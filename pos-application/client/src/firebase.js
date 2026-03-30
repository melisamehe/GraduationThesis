// client/src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// ─── EVENT TRACKING FONKSİYONLARI ────────────────────────────────────────────

export const trackProductView = (product) => {
  logEvent(analytics, "view_item", {
    item_id: product._id,
    item_name: product.title,
    item_category: product.category,
    price: product.price,
    currency: "TRY",
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  logEvent(analytics, "add_to_cart", {
    item_id: product._id,
    item_name: product.title,
    item_category: product.category,
    price: product.price,
    quantity,
    currency: "TRY",
  });
};

export const trackRemoveFromCart = (product, quantity = 1) => {
  logEvent(analytics, "remove_from_cart", {
    item_id: product._id,
    item_name: product.title,
    item_category: product.category,
    price: product.price,
    quantity,
  });
};

export const trackPurchase = (billId, totalAmount, cartItems) => {
  logEvent(analytics, "purchase", {
    transaction_id: billId,
    value: totalAmount,
    currency: "TRY",
    items: cartItems.map((item) => ({
      item_id: item._id,
      item_name: item.title,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

export const trackCategoryFilter = (category) => {
  logEvent(analytics, "select_content", {
    content_type: "category_filter",
    item_id: category,
  });
};

export const trackSearch = (searchTerm) => {
  logEvent(analytics, "search", { search_term: searchTerm });
};

export const trackPageView = (pageName) => {
  logEvent(analytics, "page_view", {
    page_title: pageName,
    page_location: window.location.href,
  });
};
