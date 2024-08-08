import React, { useEffect, useState } from "react";
import { Row, Col, Image, Rate, List } from "antd";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import * as ProductService from "../../services/ProductService";
import {
  PlusOutlined,
  MinusOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  LikeOutlined,
  TruckOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import { convertPrice } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct, resetOrder } from "../../redux/slides/orderSlide";
import * as message from "../Message/Message";
import { useMutationHooks } from "../../hooks/useMutationHook";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [repComments, setRepComments] = useState({});

  const userId = user?.id;

  const onChange = (value) => {
    setNumProduct(Number(value));
  };
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === productDetails?._id
    );
    if (
      orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
      (!orderRedux && productDetails?.countInStock > 0)
    ) {
      setErrorLimitOrder(false);
    } else if (productDetails?.countInStock === 0) {
      setErrorLimitOrder(true);
    }
  }, [numProduct]);

  const queryProductDetails = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });
  const { isLoading, data: productDetails } = queryProductDetails;
  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      );
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };
  useEffect(() => {
    if (order.isSucessOrder) {
      message.success("Đã thêm vào giỏ hàng");
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [order.isSucessOrder, dispatch]);

  const mutationReview = useMutationHooks((data) => {
    const { id, dataReview } = data;
    const res = ProductService.createProductReview(id, dataReview);
    return res;
  });
  const { data, isSuccess, isError } = mutationReview;

  const mutationRepReview = useMutationHooks((data) => {
    const { id, access_token, dataReview } = data;
    const res = ProductService.repReviewProduct(id, access_token, dataReview);
    return res;
  });
  const {
    data: dataRepReview,
    isSuccess: isSuccessRepReview,
    isError: isErrorRepreview,
  } = mutationRepReview;

  useEffect(() => {
    if (isSuccess) {
      message.success("Đánh giá đã được đăng tải!");
      setComment("");
      setRating(0);
    } else if (isError) {
      message.error("Đăng tải thất bại!");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessRepReview) {
      message.success("Trả lời bình luận đã được đăng tải!");
    } else if (isErrorRepreview) {
      message.error("Trả lời bình luận thất bại!");
    }
  }, [isSuccessRepReview, isErrorRepreview]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    mutationReview.mutate(
      { id: idProduct, dataReview: { rating, comment, userId } },
      {
        onSettled: () => {
          queryProductDetails.refetch();
        },
      }
    );
  };
  const handleRepReview = async (e, reviewId) => {
    e.preventDefault();
    const repComment = repComments[reviewId];
    mutationRepReview.mutate(
      {
        id: idProduct,
        access_token: user?.access_token,
        dataReview: { reviewId, repComment, userId },
      },
      {
        onSettled: () => {
          queryProductDetails.refetch();
        },
      }
    );
    setRepComments((prevRepComments) => ({
      ...prevRepComments,
      [reviewId]: "",
    }));
  };
  const handleRepReviewChange = (e, reviewId) => {
    setRepComments({
      ...repComments,
      [reviewId]: e.target.value,
    });
  };

  return (
    <div>
      <Row
        style={{
          padding: "16px",
          background: "#fff",
          borderRadius: "4px",
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Col
          span={8}
          style={{
            paddingLeft: "12px",
            border: "1px solid #e8e8e8",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            height: "100%",
          }}
        >
          <Image
            src={productDetails?.image}
            alt="image product"
            preview={false}
            width={"100%"}
          />
        </Col>
        <Col span={16} style={{ paddingLeft: "12px" }}>
          <Row>
            <Col span={16}>
              <WrapperStyleNameProduct style={{ fontWeight: "bold" }}>
                {productDetails?.name}
              </WrapperStyleNameProduct>
              <div>
                <Rate
                  allowHalf
                  defaultValue={productDetails?.rating}
                  value={productDetails?.rating}
                />
                <span>
                  {" ("} {productDetails?.numReviews} {") "}{" "}
                </span>
                <WrapperStyleTextSell>
                  {" "}
                  | Đã bán {productDetails?.selled}+
                </WrapperStyleTextSell>
              </div>
              <WrapperPriceProduct>
                <WrapperPriceTextProduct>
                  {convertPrice(productDetails?.price)}
                </WrapperPriceTextProduct>
              </WrapperPriceProduct>
              <WrapperAddressProduct>
                <span>Giao đến </span>
                <span className="address">{user?.address}</span> -
                <span className="change-address"> Đổi địa chỉ</span>
              </WrapperAddressProduct>
              <div
                style={{
                  margin: "10px, 0, 10px",
                  padding: "10px 10px",
                  borderTop: "1px solid #e5e5e5",
                }}
              >
                <div style={{ marginBottom: "10px" }}>Số lượng</div>
                <WrapperQualityProduct>
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleChangeCount("decrease", numProduct === 1)
                    }
                  >
                    <MinusOutlined
                      style={{ color: "#000", fontSize: "20px" }}
                    />
                  </button>
                  <WrapperInputNumber
                    onChange={onChange}
                    defaultValue={1}
                    max={productDetails?.countInStock}
                    min={1}
                    value={numProduct}
                    size="small"
                  />
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleChangeCount(
                        "increase",
                        numProduct === productDetails?.countInStock
                      )
                    }
                  >
                    <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
                  </button>
                </WrapperQualityProduct>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div>
                  <ButtonComponent
                    size={40}
                    styleButton={{
                      background: "#fff",
                      height: "48px",
                      width: "220px",
                      border: "1px solid rgb(255,57,69)",
                      borderRadius: "4px",
                    }}
                    onClick={handleAddOrderProduct}
                    textbutton={"Thêm vào giỏ hàng"}
                    styleTextButton={{
                      color: "rgb(255,57,69)",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  ></ButtonComponent>
                  {errorLimitOrder && (
                    <div style={{ color: "red" }}>Sản phẩm hết hàng</div>
                  )}
                </div>
              </div>
            </Col>
            <Col
              span={8}
              style={{
                paddingLeft: "12px",
                border: "1px solid #e8e8e8",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "16px",
                height: "330px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Chính sách bán hàng
                </span>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <CheckOutlined
                    style={{
                      color: "#1890ff",
                      fontSize: "20px",
                      marginRight: "5px",
                    }}
                  />
                  <span>Cam kết 100% chính hãng</span>
                </div>
                <div>
                  <PhoneOutlined
                    style={{
                      color: "#1890ff",
                      fontSize: "20px",
                      marginRight: "5px",
                    }}
                  />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Thông tin thêm
                </span>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <CheckCircleOutlined
                    style={{
                      color: "#1890ff",
                      fontSize: "20px",
                      marginRight: "5px",
                    }}
                  />
                  <span>Hoàn tiến 100% nếu hàng giả</span>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <LikeOutlined
                    style={{
                      color: "#1890ff",
                      fontSize: "20px",
                      marginRight: "5px",
                    }}
                  />
                  <span>Kiểm tra khi nhận hàng</span>
                </div>
                <div>
                  <TruckOutlined
                    style={{
                      color: "#1890ff",
                      fontSize: "20px",
                      marginRight: "5px",
                    }}
                  />
                  <span>Đổi trả trong 7 ngày</span>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <div
              style={{
                marginTop: "5px",
                margin: "0px, 0, 20px",
                padding: "10px 10px",
                borderTop: "1px solid #e5e5e5",
              }}
            >
              <span>Mô tả sản phẩm</span>
              <WrapperStyleNameProduct style={{ fontSize: "15px" }}>
                {productDetails?.description}
              </WrapperStyleNameProduct>
            </div>
          </Row>
        </Col>
      </Row>
      <Row
        style={{
          marginTop: "10px",
          padding: "16px",
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      >
        <Col span={24}>
          <h2>Đánh giá</h2>
          {!productDetails?.reviews || productDetails?.reviews.length === 0 ? (
            <p>Chưa có đánh giá nào!</p>
          ) : (
            <List itemLayout="vertical">
              {productDetails?.reviews.map((review) => (
                <List.Item key={review._id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ marginRight: "10px" }}>
                      {review.name}
                    </strong>
                    <Rate
                      style={{ fontSize: "15px", marginRight: "10px" }}
                      value={review.rating}
                    />
                    <ClockCircleOutlined style={{ marginRight: "5px" }} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                  </div>
                  <span style={{ marginLeft: "40px" }}>{review.comment}</span>
                  {!review?.repReview || review?.repReview.length === 0 ? (
                    ""
                  ) : (
                    <List style={{ marginLeft: "90px" }} itemLayout="vertical">
                      {review?.repReview.map((rep) => (
                        <List.Item key={rep._id}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <strong>
                              {rep.name}{" "}
                              <span
                                style={{
                                  fontWeight: "normal",
                                  fontSize: "12px",
                                }}
                              >
                                đã trả lời
                              </span>
                            </strong>
                            <ClockCircleOutlined
                              style={{ marginRight: "5px", marginLeft: "10px" }}
                            />
                            <p>{rep.createdAt.substring(0, 10)}</p>
                          </div>
                          <span style={{ marginLeft: "40px" }}>
                            {rep.repComment}
                          </span>
                        </List.Item>
                      ))}
                    </List>
                  )}
                  {user.isAdmin && (
                    <form
                      className="form"
                      onSubmit={(e) => handleRepReview(e, review._id)}
                    >
                      <div>
                        <textarea
                          style={{
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            fontSize: "14px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            outline: "none",
                            transition: "border-color 0.3s, box-shadow 0.3s",
                          }}
                          id="repComment"
                          value={repComments[review._id] || ""}
                          onChange={(e) => handleRepReviewChange(e, review._id)}
                        ></textarea>
                      </div>

                      <div>
                        <label />
                        <button className="primary" type="submit">
                          Trả lời
                        </button>
                      </div>
                    </form>
                  )}
                </List.Item>
              ))}
            </List>
          )}

          <form className="form" onSubmit={handleSubmitReview}>
            <div>
              <h3>Viết đánh giá của bạn</h3>
            </div>
            <div>
              <label htmlFor="rating" style={{ marginRight: "10px" }}>
                Chất lượng
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Chọn</option>
                <option value="1">1- Tệ</option>
                <option value="2">2- Tạm</option>
                <option value="3">3- Tốt</option>
                <option value="4">4- Rất tốt</option>
                <option value="5">5- Xuất sắc</option>
              </select>
            </div>
            <div>
              <label htmlFor="comment" style={{ display: "flex" }}>
                Bình luận:
              </label>
              <textarea
                style={{
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  outline: "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label />
              <button className="primary" type="submit">
                Đăng tải
              </button>
            </div>
          </form>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailsComponent;
