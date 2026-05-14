# bi-dashboard/dashboard.py
# Kurulum: pip install streamlit pymongo pandas plotly python-dotenv
# Çalıştır: streamlit run dashboard.py

import streamlit as st
import pandas as pd
import plotly.express as px
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(
    page_title="Mels Store BI Panel",
    page_icon="🛒",
    layout="wide",
    initial_sidebar_state="expanded",
)

@st.cache_resource
def get_db():
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "pos_db")
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]

db = get_db()

@st.cache_data(ttl=300)
def load_bills(days: int = 30):
    cutoff = datetime.utcnow() - timedelta(days=days)
    # Bill.js -> koleksiyon: "bills"
    # Alanlar: customerName, customerPhoneNumber, paymentMode,
    #          cartItems, subTotal, tax, totalAmount, createdAt (timestamps)
    bills = list(db.bills.find({"createdAt": {"$gte": cutoff}}))
    if not bills:
        return pd.DataFrame()

    rows = []
    for bill in bills:
        for item in bill.get("cartItems", []):
            rows.append({
                "bill_id":        str(bill["_id"]),
                "date":           bill.get("createdAt", datetime.utcnow()),
                "customer":       bill.get("customerName", "Bilinmeyen"),
                "customer_phone": bill.get("customerPhoneNumber", ""),
                "payment_method": bill.get("paymentMode", ""),
                "sub_total":      float(bill.get("subTotal", 0)),
                "tax":            float(bill.get("tax", 0)),
                "total_amount":   float(bill.get("totalAmount", 0)),
                "product_id":     str(item.get("_id", "")),
                "product_name":   item.get("title", item.get("name", "")),
                "category":       item.get("category", ""),
                "price":          float(item.get("price", 0)),
                "quantity":       int(item.get("quantity", 1)),
                "item_total":     float(item.get("price", 0)) * int(item.get("quantity", 1)),
            })

    df = pd.DataFrame(rows)
    if not df.empty:
        df["date"] = pd.to_datetime(df["date"])
        df["date_only"] = df["date"].dt.date
    return df


@st.cache_data(ttl=300)
def load_products():
    products = list(db.products.find({}))
    if not products:
        return pd.DataFrame()
    df = pd.DataFrame(products)
    df["_id"] = df["_id"].astype(str)
    return df


with st.sidebar:
    st.title("📊 Mels Store BI")
    st.divider()
    days_filter = st.selectbox(
        "Zaman Aralığı",
        options=[7, 14, 30, 60, 90],
        index=2,
        format_func=lambda x: f"Son {x} gün",
    )
    st.divider()
    st.caption(f"Son güncelleme: {datetime.now().strftime('%d.%m.%Y %H:%M')}")
    if st.button("🔄 Yenile", use_container_width=True):
        st.cache_data.clear()
        st.rerun()


st.title("🛒 Mels Store — İş Zekası Paneli")
st.caption(f"Son {days_filter} günlük veriler")

df = load_bills(days=days_filter)
products_df = load_products()

if df.empty:
    st.warning("⚠️ Gösterilecek satış verisi bulunamadı.")
    st.info("Beklenen koleksiyon: **bills** | Alanlar: customerName, paymentMode, cartItems, subTotal, tax, totalAmount")
    st.stop()

# bill bazında unique (totalAmount fatura bazında)
bills_summary = df.drop_duplicates("bill_id")
total_revenue  = bills_summary["total_amount"].sum()
total_tax      = bills_summary["tax"].sum()
total_sub      = bills_summary["sub_total"].sum()
total_orders   = bills_summary["bill_id"].nunique()
avg_order      = total_revenue / total_orders if total_orders > 0 else 0
total_items    = df["quantity"].sum()

col1, col2, col3, col4 = st.columns(4)
with col1: st.metric("💰 Toplam Ciro",    f"₺{total_revenue:,.2f}")
with col2: st.metric("🧾 Fatura Sayısı",  f"{total_orders:,}")
with col3: st.metric("📦 Satılan Ürün",   f"{total_items:,}")
with col4: st.metric("📊 Ort. Fatura",    f"₺{avg_order:,.2f}")

c1, c2 = st.columns(2)
with c1: st.metric("🏷️ Ara Toplam (KDV Hariç)", f"₺{total_sub:,.2f}")
with c2: st.metric("📋 Toplam KDV",             f"₺{total_tax:,.2f}")

st.divider()

col_left, col_right = st.columns([2, 1])
with col_left:
    st.subheader("📈 Günlük Ciro Trendi")
    daily = (bills_summary.groupby(bills_summary["date"].dt.date)["total_amount"]
             .sum().reset_index())
    daily.columns = ["Tarih", "Ciro (₺)"]
    fig = px.area(daily, x="Tarih", y="Ciro (₺)",
                  color_discrete_sequence=["#667eea"], template="plotly_white")
    fig.update_traces(fill="tozeroy", fillcolor="rgba(102,126,234,0.12)")
    fig.update_layout(margin=dict(l=0,r=0,t=10,b=0), height=280)
    st.plotly_chart(fig, use_container_width=True)

with col_right:
    st.subheader("💳 Ödeme Yöntemleri")
    pay = bills_summary.groupby("payment_method")["bill_id"].count().reset_index()
    pay.columns = ["Yöntem", "Adet"]
    fig2 = px.pie(pay, values="Adet", names="Yöntem", hole=0.4,
                  template="plotly_white",
                  color_discrete_sequence=px.colors.qualitative.Set3)
    fig2.update_layout(margin=dict(l=0,r=0,t=10,b=0), height=280)
    st.plotly_chart(fig2, use_container_width=True)

st.divider()
st.subheader("🏆 En Çok Satan Ürünler (Top 10)")
top = (df.groupby("product_name")
       .agg(satış=("quantity","sum"), ciro=("item_total","sum"))
       .reset_index().sort_values("satış", ascending=False).head(10))
top.columns = ["Ürün", "Satış Adedi", "Ciro (₺)"]
fig3 = px.bar(top, x="Satış Adedi", y="Ürün", orientation="h",
              color="Ciro (₺)", color_continuous_scale="Blues",
              template="plotly_white")
fig3.update_layout(margin=dict(l=0,r=0,t=10,b=0), height=340,
                   yaxis={"categoryorder":"total ascending"})
st.plotly_chart(fig3, use_container_width=True)

st.divider()
st.subheader("🏷️ Kategoriye Göre Satış")
cat = (df.groupby("category")
       .agg(satış=("quantity","sum"), ciro=("item_total","sum"))
       .reset_index().sort_values("ciro", ascending=False))
fig4 = px.bar(cat, x="category", y="ciro", color="satış",
              labels={"category":"Kategori","ciro":"Ciro (₺)","satış":"Adet"},
              color_continuous_scale="Purples", template="plotly_white")
fig4.update_layout(margin=dict(l=0,r=0,t=10,b=0), height=280)
st.plotly_chart(fig4, use_container_width=True)

st.divider()
with st.expander("📋 Ham Veri — Son Faturalar"):
    show = ["date","customer","customer_phone","payment_method",
            "sub_total","tax","total_amount"]
    st.dataframe(bills_summary[show].sort_values("date", ascending=False).head(100),
                 use_container_width=True, hide_index=True)
    csv = bills_summary[show].to_csv(index=False).encode("utf-8")
    st.download_button("⬇️ CSV İndir", csv, "fatura_raporu.csv", "text/csv")
