import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast, Bounce } from "react-toastify";
import {
  Col,
  Row,
  Form,
  Input,
  Button,
  Select,
  Skeleton,
  Upload,
  UploadProps,
  GetProp,
  message,
  InputRef,
  Tag,
  Tooltip,
} from "antd";
import { useRouter } from "next/router";
import { UilSave, UilSpinner, UilPlus } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import { createProduct, getProduct, updateProduct } from "@/functions/product";
import {
  getCategories,
  getCategorySubs,
  getBrandsByCategory,
} from "@/functions/category";
const { TextArea } = Input;
const { Option } = Select;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function EditProduct() {
  const [product, setProduct] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [categories, setCategories] = useState<any>([]);
  const [subcategory, setSubcategory] = useState<any>([]);
  const [brands, setBrands] = useState<any>([]);
  const token = Cookies.get("access_token");
  const router = useRouter();
  let { id } = router.query;
  const [inputVisible, setInputVisible] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputFeaturesVisible, setFeaturesInputVisible] = useState(false);
  const [inputFeatureValue, setInputFeatureValue] = useState("");
  const [editInputIndexFeatures, setEditInputIndexFeatures] = useState(-1);
  const [editInputValueFeatures, setEditInputValueFeatures] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  useEffect(() => {
    getProduct(id, token).then((res) => {
      if (res.data.success) {
        setProduct(res.data.product);
        getCategorySubs(res.data.product.category).then((res) => {
          console.log("SUB CATEGORY", res.data);
          if (res.data.success) {
            setSubcategory(res.data.subcategory);
          }
        });
        getBrandsByCategory(res.data.product.category, token).then((res) => {
          console.log("BRAND", res.data);
          if (res.data.success) {
            setBrands(res.data.brand);
          }
        });
        if (res.data.product.problemList) setTags(res.data.product.problemList);
        if (res.data.product.features) setFeatures(res.data.product.features);
        setLoading(false);
      }
    });
    getCategories().then((res) => {
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    });
  }, []);
  useEffect(() => {
    if (tags && tags.length > 0) {
      setProduct({ ...product, problemList: tags });
    }
  }, [tags]);
  useEffect(() => {
    if (features && features.length > 0) {
      setProduct({ ...product, features: features });
    }
  }, [features]);
  // Tags
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  // Features
  const handleCloseFeatures = (removedTag: string) => {
    const newTags = features.filter((tag) => tag !== removedTag);
    setFeatures(newTags);
  };
  const showInputFeatures = () => {
    setFeaturesInputVisible(true);
  };
  const handleInputChangeFeatures = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputFeatureValue(e.target.value);
  };
  const handleInputConfirmFeatures = () => {
    if (inputFeatureValue && !features.includes(inputFeatureValue)) {
      setFeatures([...features, inputFeatureValue]);
    }
    setFeaturesInputVisible(false);
    setInputFeatureValue("");
  };
  const handleEditInputChangeFeatures = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditInputValueFeatures(e.target.value);
  };
  const handleEditInputConfirmFeatures = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setFeatures(newTags);
    setEditInputIndexFeatures(-1);
    setEditInputValueFeatures("");
  };
  const tagInputStyle: React.CSSProperties = {
    // height: 42,
    marginTop: 10,
    verticalAlign: "top",
  };
  const tagPlusStyle: React.CSSProperties = {
    height: 32,
    marginBottom: -10,
    background: "#fff",
    borderStyle: "dashed",
  };
  const onSubmit = () => {
    setSubmit(true);
    updateProduct(id, product, token).then((res: any) => {
      if (res.data.success) {
        toast.success("Product updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        router.push("/admin/products");
      } else {
        setSubmit(false);
        toast.error("Failed to update product!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    });
  };
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setUploading(false);
        setImageUrl(url);
        setProduct({
          ...product,
          productLogo: info.file.response.image,
        });
      });
    }
  };
  const onChangeCategory = (value: any) => {
    getCategorySubs(value).then((res) => {
      console.log("SUB CATEGORY", res.data);
      if (res.data.success) {
        setSubcategory(res.data.subcategory);
      }
    });
    getBrandsByCategory(value, token).then((res) => {
      if (res.data.success) {
        setBrands(res.data.brand);
      }
    });
    setProduct({ ...product, category: value });
  };
  const onChangeBrand = (value: any) => {
    setProduct({ ...product, brand: value });
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {uploading ? <UilSpinner /> : <UilPlus />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  interface User {
    id: number;
    name: string;
    designation: string;
    img: string;
    status: string;
    email: string;
    role: string;
    created_at: string;
  }

  interface RootState {
    users: User[];
  }

  interface UserData {
    key: number;
    user: any;
    email: any;
    role: any;
    joinDate: any;
    status: any;
    action: any;
  }
  const validateMessages = {
    types: {
      string: "Please enter a valid ${label}!",
      method: "Please enter a valid ${label}!",
      array: "Please enter a valid ${label}!",
      object: "Please enter a valid ${label}!",
      number: "Please enter a valid ${label}!",
      date: "Please enter a valid ${label}!",
      boolean: "Please check this ${label}!",
      email: "Please enter a valid email!",
      url: "Please enter a valid URL!",
      hex: "Please enter a valid hex code!",
    },
    required: "This field is required.",
  };
  const PageRoutes = [
    {
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "/admin/users/product/edit",
      breadcrumbName: "Edit Product",
    },
  ];
  const [form] = Form.useForm();
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Edit Product"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={15}>
          <Col xs={24} className="mb-[25px]">
            <div className="bg-white dark:bg-white/10 m-0 p-0 text-theme-gray dark:text-white/60 text-[15px] rounded-10 relative mb-[25px]">
              <div className="p-[25px]">
                {loading ? (
                  <Skeleton active />
                ) : (
                  <Form
                    name="sDash_validation-form"
                    form={form}
                    layout="vertical"
                    disabled={submit}
                    validateMessages={validateMessages}
                    onSubmitCapture={onSubmit}
                    initialValues={product}
                  >
                    <Row gutter={30}>
                      <Col xs={24}>
                        <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                          <h1 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                            Product Data
                          </h1>
                        </div>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="category"
                          label="Category"
                          rules={[
                            {
                              required: true,
                              message: "Category is required!",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            placeholder="-- Select Category --"
                            className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                            onChange={onChangeCategory}
                            defaultValue={product.category}
                          >
                            {categories &&
                              categories.map((data: any, i: number) => (
                                <Option value={data._id} key={i}>
                                  {data.name}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="subcategory"
                          label="Sub Category"
                          rules={[
                            {
                              required: true,
                              message: "Sub Category is required!",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            placeholder={
                              subcategory.length > 0
                                ? "-- Select Sub Category --"
                                : "-- Select Category First --"
                            }
                            className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                            onChange={(e) =>
                              setProduct({
                                ...product,
                                subcategory: e,
                              })
                            }
                            defaultValue={product.subcategory}
                          >
                            {subcategory &&
                              subcategory.map((data: any, i: number) => (
                                <Option value={data._id} key={i}>
                                  {data.name}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="brand"
                          label="Brand"
                          rules={[
                            {
                              required: true,
                              message: "Brand is required!",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            placeholder={
                              brands.length > 0
                                ? "-- Select Brand --"
                                : "-- Select Category First --"
                            }
                            className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                            onChange={onChangeBrand}
                            defaultValue={product.brand}
                          >
                            {brands &&
                              brands.map((data: any, i: number) => (
                                <Option value={data._id} key={i}>
                                  {data.name}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="productName"
                          label="Product Name"
                          rules={[
                            {
                              required: true,
                              message: "Product Name is required!",
                            },
                          ]}
                        >
                          <Input
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            placeholder="Product Name"
                            onChange={(e) =>
                              setProduct({
                                ...product,
                                productName: e.target.value,
                              })
                            }
                            // onBlur={fetchProduct}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="description"
                          label="Product Description"
                          rules={[
                            {
                              required: true,
                              message: "Product Description is required!",
                            },
                          ]}
                        >
                          <Input
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            placeholder="Product Description"
                            onChange={(e) =>
                              setProduct({
                                ...product,
                                description: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="unit"
                          label="Product Unit"
                          // validateTrigger="onBlur"
                          rules={[
                            {
                              required: true,
                              message: "Product Unit is required!",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            placeholder={
                              subcategory.length > 0
                                ? "-- Select Sub Category --"
                                : "-- Select Category First --"
                            }
                            className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                            onChange={(e) =>
                              setProduct({
                                ...product,
                                unit: e,
                              })
                            }
                            defaultValue={product.unit}
                          >
                            <Option value="Unit">Unit</Option>
                            <Option value="Pcs">Pcs</Option>
                            <Option value="Pack">Pack</Option>
                            <Option value="Bundle">Bundle</Option>
                            <Option value="Kg">Kg</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col md={12} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="problemList"
                          label="Problem List"
                          // validateTrigger="onBlur"
                          rules={[
                            {
                              required: true,
                              message: "Problem List is required!",
                            },
                          ]}
                        >
                          <div>
                            {tags &&
                              tags.map<React.ReactNode>((tag, index) => {
                                if (editInputIndex === index) {
                                  return (
                                    <Input
                                      ref={editInputRef}
                                      key={tag}
                                      size="small"
                                      style={tagInputStyle}
                                      value={editInputValue}
                                      onChange={handleEditInputChange}
                                      onBlur={handleEditInputConfirm}
                                      onPressEnter={handleEditInputConfirm}
                                      placeholder="Add Tag"
                                    />
                                  );
                                }
                                const isLongTag = tag.length > 20;
                                const tagElem = (
                                  <Tag
                                    key={tag}
                                    closable={true}
                                    style={{
                                      userSelect: "none",
                                    }}
                                    onClose={() => handleClose(tag)}
                                  >
                                    <span
                                      onDoubleClick={(e) => {
                                        setEditInputIndex(index);
                                        setEditInputValue(tag);
                                        e.preventDefault();
                                      }}
                                    >
                                      {isLongTag
                                        ? `${tag.slice(0, 20)}...`
                                        : tag}
                                    </span>
                                  </Tag>
                                );
                                return isLongTag ? (
                                  <p>
                                    <Tooltip title={tag} key={tag}>
                                      {tagElem}
                                    </Tooltip>
                                  </p>
                                ) : (
                                  tagElem
                                );
                              })}
                            {inputVisible ? (
                              <Input
                                ref={inputRef}
                                type="text"
                                size="small"
                                style={tagInputStyle}
                                placeholder="Add Problem and press enter"
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputConfirm}
                                onPressEnter={handleInputConfirm}
                              />
                            ) : (
                              <Tag
                                style={tagPlusStyle}
                                icon={
                                  <UilPlus
                                    style={{
                                      marginTop: 3,
                                    }}
                                  />
                                }
                                onClick={showInput}
                              >
                                {/* Add Problem */}
                              </Tag>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                      <Col md={12} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="features"
                          label="Features"
                          rules={[
                            {
                              required: true,
                              message: "Product Value is required!",
                            },
                          ]}
                        >
                          <div>
                            {features &&
                              features.map<React.ReactNode>((tag, index) => {
                                if (editInputIndex === index) {
                                  return (
                                    <Input
                                      ref={editInputRef}
                                      key={tag}
                                      size="small"
                                      style={tagInputStyle}
                                      value={editInputValue}
                                      onChange={handleEditInputChangeFeatures}
                                      onBlur={handleEditInputConfirmFeatures}
                                      onPressEnter={
                                        handleEditInputConfirmFeatures
                                      }
                                      placeholder="Add Tag"
                                    />
                                  );
                                }
                                const isLongTag = tag.length > 20;
                                const tagElem = (
                                  <Tag
                                    key={tag}
                                    closable={true}
                                    style={{
                                      userSelect: "none",
                                    }}
                                    onClose={() => handleCloseFeatures(tag)}
                                  >
                                    <span
                                      onDoubleClick={(e) => {
                                        setEditInputIndexFeatures(index);
                                        setEditInputValueFeatures(tag);
                                        e.preventDefault();
                                      }}
                                    >
                                      {isLongTag
                                        ? `${tag.slice(0, 20)}...`
                                        : tag}
                                    </span>
                                  </Tag>
                                );
                                return isLongTag ? (
                                  <p>
                                    <Tooltip title={tag} key={tag}>
                                      {tagElem}
                                    </Tooltip>
                                  </p>
                                ) : (
                                  tagElem
                                );
                              })}
                            {inputFeaturesVisible ? (
                              <Input
                                ref={inputRef}
                                type="text"
                                size="small"
                                style={tagInputStyle}
                                placeholder="Add Features and press enter"
                                value={inputFeatureValue}
                                onChange={handleInputChangeFeatures}
                                onBlur={handleInputConfirmFeatures}
                                onPressEnter={handleInputConfirmFeatures}
                              />
                            ) : (
                              <Tag
                                style={tagPlusStyle}
                                icon={
                                  <UilPlus
                                    style={{
                                      marginTop: 3,
                                    }}
                                  />
                                }
                                onClick={showInputFeatures}
                              >
                                {/* Add Problem */}
                              </Tag>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="hexadash-form-action mt-[20px]">
                      <Button
                        className="bg-primary hover:bg-primary-hbr border-solid border-1 border-primary text-white dark:text-white/[.87] text-[14px] font-semibold leading-[22px] inline-flex items-center justify-center rounded-[4px] px-[30px] h-[44px]"
                        htmlType="submit"
                        type="primary"
                        size="large"
                      >
                        <UilSave /> Save Data
                      </Button>
                    </div>
                  </Form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default EditProduct;
