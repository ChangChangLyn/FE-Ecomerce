import { Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import icpaypal from "../../assets/images/Paypal.png";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  TikTokOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const FooterComponent = () => {
  return (
    <Row>
      <Col span={6}>
        <div style={{ marginLeft: "10px" }}>
          <h5>Tổng đài hỗ trợ miễn phí</h5>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Gọi mua hàng <span style={{ fontWeight: "bold" }}>1800.1208</span>
            {" (8h00 - 22h00)"}
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Gọi khiếu nại <span style={{ fontWeight: "bold" }}>1800.2208</span>
            {" (8h30 - 21h30)"}
          </div>
          <div style={{ marginLeft: "20px" }}>
            Gọi bảo hành <span style={{ fontWeight: "bold" }}>1800.0808</span>
            {" (8h30 - 21h00)"}
          </div>
        </div>
        <div>
          <h5 style={{ fontWeight: "bold", marginLeft: "10px" }}>
            Phương thức thanh toán
          </h5>
          <img
            src={icpaypal}
            style={{
              height: "50px",
              width: "50px",
              marginLeft: "30px",
              objectFit: "cover",
            }}
          />
        </div>
      </Col>
      <Col span={6} style={{ borderLeft: "1px solid #e5e5e5" }}>
        <div style={{ marginLeft: "10px" }}>
          <h5>Thông tin liên hệ</h5>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            <EnvironmentOutlined
              style={{
                fontSize: "15px",
                marginRight: "5px",
              }}
            />
            <span>Topaz Home 2 - Tân Phú - Q9 - TP.HCM</span>
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            <PhoneOutlined
              style={{
                fontSize: "15px",
                marginRight: "5px",
              }}
            />
            <span>0378861395</span>
          </div>
          <div style={{ marginLeft: "20px" }}>
            <MailOutlined
              style={{
                fontSize: "15px",
                marginRight: "5px",
              }}
            />
            <span>buingoctu02@gmail.com</span>
          </div>
        </div>
        <div>
          <h5 style={{ fontWeight: "bold", marginLeft: "10px" }}>
            Kết nối nối với Dúm Store
          </h5>
          <div>
            <a
              href="https://www.facebook.com/B.NgocTuuu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookOutlined
                style={{
                  fontSize: "35px",
                  marginLeft: "30px",
                  color: "#1890ff",
                }}
              />
            </a>
            <a
              href="https://www.instagram.com/b.ngtuu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramOutlined
                style={{
                  fontSize: "35px",
                  marginLeft: "30px",
                  color: "#fff",
                  background:
                    "linear-gradient(#3f51b1,#5a55ae,#7b5fac,#8f6aae,#a86aa4,#cc6b8e,#f18271,#f3a469,#f7c978)",
                  borderRadius: "10px",
                }}
              />
            </a>
            <a
              href="https://www.tiktok.com/@b.ngtuu02?lang=vi-VN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TikTokOutlined
                style={{
                  fontSize: "35px",
                  marginLeft: "30px",
                  background: "#000",
                  color: "#fff",
                  borderRadius: "10px",
                }}
              />
            </a>
            <a
              href="https://www.facebook.com/B.NgocTuuu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterOutlined
                style={{
                  fontSize: "35px",
                  marginLeft: "30px",
                  color: "#1890ff",
                }}
              />
            </a>
            <a
              href="https://www.youtube.com/channel/UCfQyWC7OP3RV27vL2xABoww"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YoutubeOutlined
                style={{
                  fontSize: "35px",
                  marginLeft: "30px",
                  color: "red",
                }}
              />
            </a>
          </div>
        </div>
      </Col>
      <Col span={6} style={{ borderLeft: "1px solid #e5e5e5" }}>
        <div style={{ marginLeft: "10px" }}>
          <h5>Thông tin và chính sách</h5>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Mua hàng và thanh toán Online
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Thông tin hóa đơn mua hàng
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Chính sách giao hàng
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Trung tâm bảo hành chính hãng
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Tra điểm Smember
          </div>
          <div style={{ marginLeft: "20px" }}>
            Chính sách khui hộp sản phẩm Apple
          </div>
        </div>
      </Col>
      <Col span={6} style={{ borderLeft: "1px solid #e5e5e5" }}>
        <div style={{ marginLeft: "10px" }}>
          <h5>Dịch vụ và thông tin khác</h5>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Ưu đãi thanh toán
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Quy chế hoạt động
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Chính sách Bảo hành
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Chính sách bảo mật thông tin cá nhân
          </div>
          <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
            Liên kết hợp tác kinh doanh
          </div>
          <div style={{ marginLeft: "20px" }}>Tuyển dụng</div>
        </div>
      </Col>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid #e5e5e5",
          width: "100%",
        }}
      >
        <p style={{ textAlign: "center" }}>
          Copyright © 2024 Bản quyền của cá nhân - Bùi Ngọc Tú - Địa chỉ: Topaz
          Home 2 đường 154 - Tân Phú - TP.Thủ Đức - TP.HCM - Thực hiện vào tháng
          7/2024
        </p>
      </div>
    </Row>
  );
};

export default FooterComponent;
