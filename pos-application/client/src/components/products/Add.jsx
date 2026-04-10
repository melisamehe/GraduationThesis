import { Button, Form, Input, message, Modal, Select } from 'antd'
import React from 'react'

const Add = ({isAddModalOpen, setIsAddModalOpen,categories,products,setProducts}) => {
  const [form] = Form.useForm();
     const onFinish = (values)=> {
          try{
            const processedValues = {
              ...values,
              images: values.images ? values.images.split(',').map(url => url.trim()).filter(url => url) : []
            };
            fetch(process.env.REACT_APP_SERVER_URL + "/api/products/add-product",{
              method:"POST",
              body: JSON.stringify(processedValues),
              headers: {"Content-type":"application/json; charset=UTF-8"},
            });
            message.success("Ürün başarıyla eklendi");
            form.resetFields();
            setProducts([
              ...products,
              {
                ...processedValues,
                _id: Math.random(),
                price: Number(values.price),
              },
            ]);
          }catch(error){
            
          }
      };
  return (
        <Modal
        title="Yeni Ürün Ekle"
        closable={true}
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={false}
       
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item name="title" label="Ürün Adı" rules={[{ required: true, message:"Ürün Adı Alanı Boş Geçilemez!"}]}>
             <Input placeholder="Ürün adı giriniz."/>
          </Form.Item>
            <Form.Item name="img" label="Ürün Görseli" rules={[{ required: true, message:"Ürün Görseli Alanı Boş Geçilemez!"}]}>
             <Input placeholder="Ürün görseli giriniz."/>
          </Form.Item>
            <Form.Item name="price" 
            label="Ürün Fiyatı" 
            rules={[{ required: true, message:"Ürün Fiyatı Alanı Boş Geçilemez!"}]}>
             <Input placeholder="Ürün fiyatı giriniz."/>
          </Form.Item>
            <Form.Item name="description" label="Ürün Açıklaması">
             <Input.TextArea placeholder="Ürün açıklaması giriniz. (Opsiyonel)" rows={3}/>
          </Form.Item>
            <Form.Item name="images" label="Ek Görseller (Virgülle Ayrılmış URL'ler)">
             <Input.TextArea placeholder="Ek görsel URL'lerini virgülle ayırarak giriniz. (Opsiyonel)" rows={3}/>
          </Form.Item>
          
           <Form.Item name="category" 
            label="Kategori Seç" 
            rules={[{ required: true, message:"Kategori Alanı Boş Geçilemez!"}]}>
              <Select
    showSearch
    placeholder="Search to Select"
    optionFilterProp="children"
    filterSort={(optionA, optionB) =>
      (optionA?.title ?? '').toLowerCase().localeCompare((optionB?.title ?? '').toLowerCase())
    }
    options={categories}
  />
          </Form.Item>
           
          <Form.Item className="flex justify-end mb-0">
            <Button type="primary" htmlType="submit">Oluştur</Button>
          </Form.Item>
        </Form>
        
      </Modal>
  )
}

export default Add