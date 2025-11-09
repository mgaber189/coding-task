import React, { useEffect, useState } from "react";
import { Table, Spin, Image, Tag, Space, Tooltip, Button } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import instance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function ProductList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/read_products.php");
      setData(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (record) => {
    navigate(`/edite-product/${record.product_id}`);
  };

  const handleShowMore = (record) => {
    navigate(`/productDetails/${record.product_id}`);
  };

  const handleDelete = async (id) => {
    try {
      await instance.post("/products/delete_product.php", {
        product_id: id,
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };
  const columns = [
    {
      title: "Image",
      dataIndex: "product_image",
      key: "product_image",
      render: (images) =>
        images && images.length > 0 ? (
          <Image
            width={60}
            src={images[0]}
            style={{ borderRadius: 6 }}
            alt="product"
            preview={false}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Pieces",
      dataIndex: "number_of_pieces",
      key: "number_of_pieces",
    },
    {
      title: "Hidden",
      dataIndex: "product_hidden",
      key: "product_hidden",
      render: (value) =>
        value === 1 ? (
          <Tag color="red">Hidden</Tag>
        ) : (
          <Tag color="green">Visible</Tag>
        ),
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      render: (value) => `${value} EGP`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <EditOutlined
              onClick={() => handleEdit(record)}
              style={{ color: "#1890ff", cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Show More">
            <EyeOutlined
              onClick={() => handleShowMore(record)}
              style={{ color: "#52c41a", cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              onClick={() => handleDelete(record?.product_id)}
              style={{ color: "#ff4d4f", cursor: "pointer" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="p-16">
          <Space style={{ marginBottom: 16 }}>
            <Button
              type="text"
              icon={
                <PlusCircleFilled
                  style={{ color: "#4D83FF", fontSize: "24px" }}
                />
              }
              style={{
                backgroundColor: "#fafbfd",
                borderRadius: 0,
                padding: "12px 24px",
              }}
              onClick={() => navigate("/add-product")}
            />
          </Space>
          <Table columns={columns} dataSource={data} rowKey="product_id" />
        </div>
      )}
    </div>
  );
}

export default ProductList;
