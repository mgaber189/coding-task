import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Button, Spin, Empty, Tag } from "antd";
import instance from "../../utils/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
const imageUrls = [
  "https://example.com/images/image1.jpg",
  "https://example.com/images/image2.png",
  "https://example.com/images/image3.gif",
  "https://example.com/images/another-image.jpeg"
];
function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProductList = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/read_products.php");
      const products = res?.data?.data || [];
      console.log(res);
      const filteredProduct = products?.find(
        (p) => Number(p.product_id) === Number(id)
      );
      setProduct(filteredProduct || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, [id]);

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  if (!product) return <Empty description="Product not found" />;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      {product.product_image && product.product_image.length > 0 ? (
        <Swiper
          navigation
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          style={{ marginBottom: 30 }}>
          {product.product_image.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={product.product_name}
                style={{ width: "100%", height: 400, objectFit: "contain" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Empty description="No images available" style={{ marginBottom: 30 }} />
      )}

      <Descriptions
        title={product.product_name}
        bordered
        column={1}
        size="default">
        <Descriptions.Item label="Product ID">
          {product.product_id}
        </Descriptions.Item>
        <Descriptions.Item label="Name (EN)">
          {product.product_name_en}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {product.product_description}
        </Descriptions.Item>
        <Descriptions.Item label="Description (EN)">
          {product.product_description_en}
        </Descriptions.Item>
        <Descriptions.Item label="Number of pieces">
          {product.number_of_pieces}
        </Descriptions.Item>
        <Descriptions.Item label="Price">
          {product.product_price} EGP
        </Descriptions.Item>
        <Descriptions.Item label="Price after discount">
          {product.price_after_discount.toFixed(2)} EGP
        </Descriptions.Item>
        <Descriptions.Item label="Discount">
          {product.discount}%
        </Descriptions.Item>
        <Descriptions.Item label="Add date">
          {product.add_date}
        </Descriptions.Item>
        <Descriptions.Item label="Hidden">
          {product.product_hidden ? (
            <Tag color="red">Hidden</Tag>
          ) : (
            <Tag color="green">Visible</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>

      <Button
        type="primary"
        style={{ marginTop: 20 }}
        onClick={() => navigate("/")}>
        Back to Product List
      </Button>
    </div>
  );
}

export default ProductDetails;
