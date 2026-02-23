import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Bounce, toast } from "react-toastify";
import Head from "next/head";
import {
  Col,
  Row,
  Input,
  Button,
  Select,
  Card,
  Skeleton,
  Table,
  Empty,
  Form,
} from "antd";
import { useRouter } from "next/router";
import { UilSave, UilEdit } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import {
  getContractDetail,
  getServicePartner,
  updateServicePartner,
} from "@/functions/contract";
import { createServicePartnerContract } from "@/functions/partnerContract";
import Heading from "@/components/heading";
import { ContractResponse } from "@/types/contract";
const { Option } = Select;

interface RowSelectionItem {
  key: string | number;
  device: {
    key: string;
  };
  location: {
    key: string;
  };
  servicePartner: {
    key: string;
  };
}

interface Product {
  _id: string;
  productName: string;
}

interface ProductItem {
  _id: string;
  product: Product;
  location: string;
  serialNumber: string;
}

interface Device {
  _id: string;
  location: string;
  productItem: ProductItem;
  servicePartner: ServicePartnerResponse[];
}

interface DeviceListData {
  key: number;
  device: any;
  location: any;
  servicePartner: any;
}

interface ServicePartnerResponse {
  _id: string;
  contract: string;
  servicePartner: {
    companyName: string;
  };
  devices: any[];
}

interface ServicePartnerData {
  contractId: string;
  servicePartnerId: string;
  deviceIds: string[];
}

function DetailContract() {
  const token = Cookies.get("access_token");
  const router = useRouter();
  const [form] = Form.useForm();
  let { id } = router.query;
  const [contract, setContract] = useState<ContractResponse | null>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<any>([]);
  const [data, setData] = useState<any>({});
  const [canSelect, setCanSelect] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string>("");
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    loadContract();
    getServicePartner(token).then((res) => {
      if (res.data.success) {
        setPartners(res.data.result);
      }
    });
  }, []);
  const loadContract = () => {
    setLoading(true);
    getContractDetail(id, token).then((res) => {
      if (res.data.success) {
        setContract(res.data.contract);
        setDevices(res.data.devices);
        console.log("contract data: >>> ", res.data);
        setData({ ...data, customer: res.data?.contract?.customer?._id });
        setLoading(false);
        if (res.data.contract.havePartner) {
          setCanSelect(false);
        }
      } else {
        toast.error(res.data.message, {
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
        setLoading(false);
      }
    });
  };
  const handleChangePartner = () => {
    setCanSelect(!canSelect);
  };

  const PageRoutes = [
    {
      path: "/manage",
      breadcrumbName: "Dashboard",
    },
    {
      path: "first",
      breadcrumbName: "Detail Contract",
    },
  ];

  const deviceTableData: DeviceListData[] = [];

  devices.map((device: Device, id) => {
    const { productItem, location, _id, servicePartner } = device;
    const deviceLabel = `${productItem.product.productName} - ${productItem.serialNumber}`;
    const SP = servicePartner.find((e) => e.contract == contract?._id);
    const existingPartnerContract = SP?._id;
    const SPLabel = SP?.servicePartner.companyName;
    return deviceTableData.push({
      key: id,
      device: (
        <div key={_id} className="flex items-center">
          <figcaption>
            <Heading
              className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
              as="h6"
            >
              {deviceLabel}
            </Heading>
          </figcaption>
        </div>
      ),
      location: (
        <div className="text-body dark:text-white/60 text-[15px] font-medium">
          {location}
        </div>
      ),
      servicePartner: <div>{SPLabel ? SPLabel : null}</div>,
    });
  });

  const devicesTableColumns = [
    {
      title: "Device",
      dataIndex: "device",
      key: "device",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Service Partner",
      dataIndex: "servicePartner",
      key: "servicePartner",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: RowSelectionItem[]) => {
      setSelectedDevice(selectedRows.map((item) => item.device.key));
    },
  };

  const handleSetServicePartner = () => {
    if (selectedPartner == "") {
      alert("Pilih Partner terlebih dahulu");
      return;
    }
    const data: ServicePartnerData = {
      contractId: String(contract?._id),
      deviceIds: selectedDevice,
      servicePartnerId: selectedPartner,
    };
    console.log("Subited data SP contract: ", data);
    createServicePartnerContract(data, token).then((res) => {
      if (res.data.success) {
        loadContract();
        toast.success("Service Partner Assign to Contract Successfuly!", {
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
      } else {
        toast.error(res.data.message, {
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

  return (
    <>
      <Head>
        <title>Detail Contract - Admin Service Hub</title>
      </Head>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Contract"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Card>
          {loading ? (
            <div style={{ padding: 20 }}>
              <Skeleton active />
            </div>
          ) : (
            <Row gutter={15}>
              <Col xs={24}>
                <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                  <h3 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                    Contract Data
                  </h3>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <table>
                  <tr>
                    <td>Company Name</td>
                    <td>:</td>
                    <td>{contract?.customer?.companyName}</td>
                  </tr>
                  <tr>
                    <td>Contract Name</td>
                    <td>:</td>
                    <td>{contract?.number}</td>
                  </tr>
                  <tr>
                    <td>Contract Duration</td>
                    <td>:</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {contract?.duration} {contract?.durationUnit}
                    </td>
                  </tr>
                  <tr>
                    <td>Contract Value</td>
                    <td>:</td>
                    <td>
                      {"Rp"}
                      {contract?.values
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                    </td>
                  </tr>
                </table>
              </Col>
              <Col xs={24} md={12}>
                <table>
                  <tr>
                    <td>PIC</td>
                    <td>:</td>
                    <td>{contract?.customer?.fullName}</td>
                  </tr>
                  <tr>
                    <td>PIC Phone</td>
                    <td>:</td>
                    <td>{contract?.customer?.phone}</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td>:</td>
                    <td>{contract?.customer?.companyPhone}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td>{contract?.customer?.email}</td>
                  </tr>
                </table>
              </Col>
              {contract?.status !== "pending" ? (
                <Col xs={24} className="my-10">
                  <Table
                    className="[&>div>div>.ant-table]:mb-7 [&>div>div>.ant-table]:pb-5 [&>div>div>.ant-table]:border-b [&>div>div>.ant-table]:border-regular dark:[&>div>div>.ant-table]:border-white/10 ltr:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pl-[20px] ltr:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pl-[20px] rtl:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pr-[20px] rtl:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pr-[20px]"
                    rowSelection={rowSelection}
                    dataSource={deviceTableData}
                    columns={devicesTableColumns}
                    locale={{
                      emptyText: loading ? (
                        <Skeleton active={true} />
                      ) : (
                        <Empty />
                      ),
                    }}
                    pagination={{
                      defaultPageSize: 10,
                      total: deviceTableData.length,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                      className:
                        "text-end [&>li]:margin-0 [&>li]:border [&>li]:margin-0 [&>li]:bg-white [&>li]:rounded-6 dark:[&>li]:bg-white/10 dark:[&>li]:margin-0 [&>li]:border-regular dark:[&>li]:border-white/10 [&>li>.ant-pagination-item-link]:flex [&>li>.ant-pagination-item-link]:items-center [&>li>.ant-pagination-item-link]:justify-center [&>li>.ant-pagination-item-link]:border-none [&>li>.ant-pagination-item-link>.anticon>svg]:text-light [&>li>.ant-pagination-item-link>.anticon>svg]:dark:text-white/30 [&>.ant-pagination-item>a]:text-body [&>.ant-pagination-item>a]:dark:text-white/60 [&>.ant-pagination-item-active]:bg-primary [&>.ant-pagination-item.ant-pagination-item-active>a]:text-white [&>.ant-pagination-item.ant-pagination-item-active>a]:dark:text-white/60 [&>.ant-pagination-options]:border-none [&>.ant-pagination-options>.ant-select:hover>.ant-select-selector]:border-primary [&>.ant-pagination-options>.ant-select>.ant-select-selector]:h-[33px] dark:[&>.ant-pagination-options>.ant-select>.ant-select-selector]:text-white/[.60] dark:[&>.ant-pagination-options>.ant-select>.ant-select-arrow]:text-white/[.60] [&>.ant-pagination-options>.ant-select>.ant-select-selector]:border-0 dark:[&>.ant-pagination-options>.ant-select>.ant-select-selector]:border-white/10 [&>.ant-pagination-options>.ant-select>.ant-select-selector]:rounded-6",
                    }}
                  />
                  <>
                    <Col span={12} className="my-5 flex items-center gap-2">
                      <p className="font-semibold">
                        Select Device To Assign Service Partner!{" "}
                      </p>
                    </Col>
                  </>
                  {selectedDevice && (
                    <>
                      <Col span={12} className="my-5 flex items-center gap-2">
                        <p className="font-semibold">Selected Device Count: </p>
                        <p>{selectedDevice.length}</p>
                      </Col>
                    </>
                  )}

                  <Form
                    name="assignPartnerForm"
                    form={form}
                    disabled={submit}
                    labelAlign="left"
                    layout="horizontal"
                    // onSubmitCapture={handleSetServicePartner}
                  >
                    <Col span={12} className="mt-5">
                      <Form.Item
                        label="Service Partner"
                        name="status"
                        rules={[
                          {
                            required: true,
                            message: "Service Partner is required",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          showSearch
                          placeholder="-- Select Partner --"
                          className="[&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                          style={{ width: "100%" }}
                          onChange={(e) => setSelectedPartner(e)}
                        >
                          {partners &&
                            partners.map((data: any, i: number) => (
                              <Option value={data._id} key={i}>
                                {data.companyName}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12} className="mt-5">
                      <Button
                        className="bg-primary hover:bg-primary-hbr border-solid border-1 border-primary text-white dark:text-white/[.87] text-[14px] font-semibold leading-[22px] inline-flex items-center justify-center rounded-[4px]"
                        htmlType="submit"
                        type="primary"
                        size="large"
                        disabled={selectedDevice.length > 0 ? false : true}
                        onClick={handleSetServicePartner}
                      >
                        <UilSave /> Save Data
                      </Button>
                    </Col>
                  </Form>
                </Col>
              ) : (
                <h5>
                  Status Langganan masih pending, tunggu partner mengaktifkan
                  kontrak
                </h5>
              )}

              {/* {JSON.stringify(data)}
                {JSON.stringify(devices)} */}
              {/* <Button type="primary" className="mb-3 mt-5 mr-3">
                <Link href="/admin/contracts">Back</Link>
              </Button> */}
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

export default DetailContract;
