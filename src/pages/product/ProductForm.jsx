import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Button, Spin, Select, Upload, Image, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import instance from "../../utils/axios";

const validationSchema = Yup.object({
  product_name: Yup.string().required("Product name is required"),
  product_name_en: Yup.string().required("Product name (EN) is required"),
  product_description: Yup.string().nullable(),
  number_of_pieces: Yup.number().required("Number of pieces is required"),
  product_price: Yup.number().required("Product price is required"),
  price_after_discount: Yup.number().required(
    "Price after discount is required"
  ),
  discount: Yup.number().nullable(),
  product_hidden: Yup.string()
    .oneOf(["yes", "no"])
    .required("Visibility is required"),
  product_image: Yup.array().nullable(),
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const [initialValues, setInitialValues] = useState({
    product_name: "",
    product_name_en: "",
    product_description: "",
    number_of_pieces: 0,
    product_price: 0,
    price_after_discount: 0,
    discount: 0,
    product_hidden: "no",
    product_image: [],
  });

  const fetchProductList = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/read_products.php");
      const products = res?.data?.data || [];
      const filteredProduct = products.find(
        (p) => Number(p.product_id) === Number(id)
      );

      if (filteredProduct) {
        setInitialValues({
          product_name: filteredProduct.product_name || "",
          product_name_en: filteredProduct.product_name_en || "",
          product_description: filteredProduct.product_description || "",
          number_of_pieces: filteredProduct.number_of_pieces || 0,
          product_price: filteredProduct.product_price || 0,
          price_after_discount: filteredProduct.price_after_discount || 0,
          discount: filteredProduct.discount || 0,
          product_hidden: filteredProduct.product_hidden ? "yes" : "no",
          product_image: filteredProduct.product_image || [],
        });
      }
    } catch {
      toast.error("Failed to fetch product data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductList();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoadingButton(true);

      const formData = new FormData();
      formData.append("product_id", id || "");
      formData.append("product_name", values.product_name);
      formData.append("product_name_en", values.product_name_en);
      formData.append("product_description", values.product_description);
      formData.append("number_of_pieces", values.number_of_pieces);
      formData.append("product_price", values.product_price);
      formData.append("price_after_discount", values.price_after_discount);
      formData.append("discount", values.discount);
      formData.append(
        "product_hidden",
        values.product_hidden === "yes" ? 1 : 0
      );

      values.product_image.forEach((img) => {
        formData.append("product_image[]", img);
      });

      const endpoint = id
        ? "/products/update_product.php"
        : "/products/create_product.php";

      await instance.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        id ? "Product updated successfully" : "Product created successfully"
      );
      navigate("/");
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoadingButton(false);
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {id ? "Edit Product" : "Add Product"}
        </h2>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="flex flex-col">
                  <label className="font-medium mb-2">Product Name (AR)</label>
                  <Input
                    name="product_name"
                    style={{
                      width: "100%",
                      borderRadius: "0.75rem",
                      backgroundColor: "#F1F4F9",
                      color: "#202224",
                      padding: "0.75rem 1.25rem",
                      border: "1px solid transparent",
                      outline: "none",
                    }}
                    value={values.product_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="اسم المنتج بالعربي"
                  />
                  {touched.product_name && errors.product_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.product_name}
                    </p>
                  )}
                </div>

                {/* Product Name EN */}
                <div className="flex flex-col">
                  <label className="font-medium mb-2">Product Name (EN)</label>
                  <Input
                    name="product_name_en"
                    value={values.product_name_en}
                    style={{
                      width: "100%",
                      borderRadius: "0.75rem",
                      backgroundColor: "#F1F4F9",
                      color: "#202224",
                      padding: "0.75rem 1.25rem",
                      border: "1px solid transparent",
                      outline: "none",
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter product name in English"
                  />
                  {touched.product_name_en && errors.product_name_en && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.product_name_en}
                    </p>
                  )}
                </div>

                {/* Number of Pieces */}
                <div className="flex flex-col">
                  <label className="font-medium mb-2">Number of Pieces</label>
                  <Input
                    type="number"
                    name="number_of_pieces"
                    style={{
                      width: "100%",
                      borderRadius: "0.75rem",
                      backgroundColor: "#F1F4F9",
                      color: "#202224",
                      padding: "0.75rem 1.25rem",
                      border: "1px solid transparent",
                      outline: "none",
                    }}
                    value={values.number_of_pieces}
                    onChange={handleChange}
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col">
                  <label className="font-medium mb-2">Price</label>
                  <Input
                    type="number"
                    name="product_price"
                    style={{
                      width: "100%",
                      borderRadius: "0.75rem",
                      backgroundColor: "#F1F4F9",
                      color: "#202224",
                      padding: "0.75rem 1.25rem",
                      border: "1px solid transparent",
                      outline: "none",
                    }}
                    value={values.product_price}
                    onChange={handleChange}
                  />
                </div>

                {/* Price After Discount */}
                <div className="flex flex-col">
                  <label className="font-medium mb-2">
                    Price After Discount
                  </label>
                  <Input
                    type="number"
                    name="price_after_discount"
                    style={{
                      width: "100%",
                      borderRadius: "0.75rem",
                      backgroundColor: "#F1F4F9",
                      color: "#202224",
                      padding: "0.75rem 1.25rem",
                      border: "1px solid transparent",
                      outline: "none",
                    }}
                    value={values.price_after_discount}
                    onChange={handleChange}
                  />
                </div>

                {/* Discount */}
                <div className="flex flex-col">
                  <label className="font-medium mb-2">Discount (%)</label>
                  <Input
                    type="number"
                    style={{
                      width: "100%",
                      borderRadius: "0.75rem",
                      backgroundColor: "#F1F4F9",
                      color: "#202224",
                      padding: "0.75rem 1.25rem",
                      border: "1px solid transparent",
                      outline: "none",
                    }}
                    name="discount"
                    value={values.discount}
                    onChange={handleChange}
                  />
                </div>

                {/* Visibility */}
                <div className="flex flex-col">
                  <label className="font-medium mb-2">Visibility</label>
                  <Select
                    value={values.product_hidden}
                    className="w-full custom-select"
                    onChange={(val) => setFieldValue("product_hidden", val)}
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 flex flex-col">
                  <label className="font-medium mb-2">Description</label>
                  <Input.TextArea
                    name="product_description"
                    style={{
                      width: "100%",
                      borderRadius: "0.75rem",
                      backgroundColor: "#F1F4F9",
                      color: "#202224",
                      padding: "0.75rem 1.25rem",
                      border: "1px solid transparent",
                      outline: "none",
                    }}
                    value={values.product_description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                {/* Upload Images */}
                <div className="md:col-span-2">
                  <Divider orientation="left">Product Images</Divider>

                  <Upload
                    listType="picture-card"
                    beforeUpload={(file) => {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setFieldValue("product_image", [
                          ...values.product_image,
                          e.target.result,
                        ]);
                      };
                      reader.readAsDataURL(file);
                      return false;
                    }}
                    fileList={[]}>
                    + Upload
                  </Upload>

                  <div className="flex flex-wrap gap-4 mt-4">
                    {values.product_image.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <Image
                          width={120}
                          height={120}
                          src={img}
                          style={{ borderRadius: 8 }}
                        />
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            const newList = values.product_image.filter(
                              (_, i) => i !== idx
                            );
                            setFieldValue("product_image", newList);
                          }}
                          className="absolute top-1 right-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto">
                  Back to Product List
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loadingButton}
                  className="w-full sm:w-auto">
                  {id ? "Update Product" : "Add Product"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductForm;
