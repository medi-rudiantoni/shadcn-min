import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Col,
  Row,
  Button,
  Modal,
  Collapse,
  Skeleton,
  Input,
  Select,
  Form,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bounce, toast } from "react-toastify";
import moment from "moment";
import { UilPrint, UilPlus } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import { getTicket, updateTicket, deleteTicket } from "@/functions/ticketing";
import { Cards } from "@/components/cards/frame/cards-frame";
const { TextArea } = Input;

const TicketDetail = () => {
  //router
  const [form] = Form.useForm();
  const router = useRouter();
  let { id } = router.query;
  const [values, setValues] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  // const { user } = useSelector((state) => ({ ...state }));
  const authtoken = Cookies.get("access_token");
  // const { order_subs_id, customer, ticket_price, status } = values;
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState("");
  const [submit, setSubmit] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadTicket();
  }, []);
  const loadTicket = () => {
    getTicket(authtoken, id)
      .then((res) => {
        // console.log("SINGLE DATA", res.data);
        setValues(res.data.result);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const onSubmit = () => {
    setSubmit(true);
    updateTicket(authtoken, id, {
      status,
      summary,
      servicePartner: values.contract.servicePartner._id,
    }).then((res) => {
      if (res.data.success) {
        router.push("/admin/ticketing");
        toast.success("Ticket updated successfully!", {
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
        setSubmit(false);
      }
    });
  };
  const validateMessages = {
    types: {
      string: "Please enter a valid ${label}!",
    },
    required: "This field is required.",
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    deleteTicket(authtoken, id)
      .then((res) => {
        if (res.data.success) {
          toast.success("Ticket deleted successfully!", {
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
          router.push("/admin/ticketing");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete ticket.");
      })
      .finally(() => {
        setDeleteLoading(false);
        setIsDeleteModalVisible(false);
      });
  };
  const PageRoutes = [
    {
      path: "/manage",
      breadcrumbName: "Dashboard",
    },
    {
      path: "first",
      breadcrumbName: "Tickets",
    },
    {
      path: "second",
      breadcrumbName: "Detail",
    },
  ];
  return (
    <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
      <>
        <PageHeaders
          routes={PageRoutes}
          title="Ticket Detail"
          className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
        />

        <Cards
          className="h-full border-none ant-card-body-p-25 ant-card-head-px-25 ant-card-head-b-none ant-card-body-pt-0 ant-card-head-title-lg"
          size="large"
        >
          {loading ? (
            <Skeleton active />
          ) : (
            <div
              className="flex-1 h-auto px-8 xl:px-[15px]"
              style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
            >
              <h5>Ticket #{values?.number}</h5>
              <hr className="mb-5" />
              <Row>
                <Col span={24}>
                  {/* {JSON.stringify(values)} */}
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p>Type Ticket</p>
                        </td>
                        <td>
                          <p
                            style={{
                              marginLeft: 10,
                              textTransform: "capitalize",
                            }}
                          >
                            : {values?.type}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Status</p>
                        </td>
                        <td>
                          <p
                            style={{
                              marginLeft: 10,
                              textTransform: "capitalize",
                            }}
                          >
                            : {values?.status}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Problem</p>
                        </td>
                        <td>
                          <p
                            style={{
                              marginLeft: 10,
                              textTransform: "capitalize",
                            }}
                          >
                            : {values?.problemType}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Description</p>
                        </td>
                        <td>
                          <p
                            style={{
                              marginLeft: 10,
                              textTransform: "capitalize",
                            }}
                          >
                            : {values?.description}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Date</p>
                        </td>
                        <td>
                          <p style={{ marginLeft: 10 }}>
                            :{" "}
                            {moment(values?.created_at).format(
                              "DD MMM YYYY HH:mm:ss",
                            )}
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <p>Company Name</p>
                        </td>
                        <td>
                          <p style={{ marginLeft: 10 }}>
                            : {values?.customer?.companyName}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Address</p>
                        </td>
                        <td>
                          <p
                            style={{
                              marginLeft: 10,
                              textTransform: "capitalize",
                            }}
                          >
                            : {values?.customer?.address}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>PIC</p>
                        </td>
                        <td>
                          <p
                            style={{
                              marginLeft: 10,
                              textTransform: "capitalize",
                            }}
                          >
                            : {values?.customer?.fullName}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Phone</p>
                        </td>
                        <td>
                          <p
                            style={{
                              marginLeft: 10,
                              textTransform: "capitalize",
                            }}
                          >
                            : {values?.customer?.phone}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
              <hr className="mb-3 mt-5" />
              <Row gutter={16}>
                {values.contract.servicePartner ? (
                  values.status == "dispatch" ? (
                    <Col span={12} className="gutter-row">
                      <Form
                        name="sDash_validation-form"
                        form={form}
                        disabled={submit}
                        layout="vertical"
                        validateMessages={validateMessages}
                        onSubmitCapture={onSubmit}
                      >
                        <h5 className="mb-3">Assasement Detail</h5>
                        <label htmlFor="">Summary</label>
                        <TextArea
                          rows={4}
                          disabled={values.status != "dispatch"}
                          onChange={(e) => setSummary(e.target.value)}
                          required
                        />
                        <label htmlFor="">Status</label>
                        <Select
                          placeholder="-- Select Status --"
                          style={{ width: "100%" }}
                          options={[
                            { value: "finish", label: <span>Finish</span> },
                            { value: "pending", label: <span>Pending</span> },
                          ]}
                          onChange={(val) => setStatus(val)}
                        />
                        {status == "finish" ? (
                          <Button
                            type="primary"
                            className="mt-5"
                            htmlType="submit"
                          >
                            Solved by Customer Service
                          </Button>
                        ) : (
                          status == "pending" && (
                            <Button danger className="mt-5" htmlType="submit">
                              Assign to Service Partner
                            </Button>
                          )
                        )}
                      </Form>
                    </Col>
                  ) : (
                    <Col span={12} className="gutter-row">
                      <p>{values.summary}</p>
                    </Col>
                  )
                ) : (
                  <Col span={12} className="gutter-row">
                    <p>
                      Service Partner belum dipilih, silahkan pilih Service
                      Partner pada halaman Contract atau klik link berikut
                    </p>
                    <Link
                      href={"/admin/contracts/detail/" + values.contract._id}
                    >
                      Add Service Partner
                    </Link>
                  </Col>
                )}
                {values.contract.servicePartner && (
                  <Col span={12} className="gutter-row">
                    <h5 className="mb-3">Service Partner</h5>
                    <table>
                      <tr>
                        <td>Company Name</td>
                        <td>:</td>
                        <td>{values.contract.servicePartner.companyName}</td>
                      </tr>
                      <tr>
                        <td>Company Email</td>
                        <td>:</td>
                        <td>{values.contract.servicePartner.companyEmail}</td>
                      </tr>
                      <tr>
                        <td>Company Phone</td>
                        <td>:</td>
                        <td>{values.contract.servicePartner.companyPhone}</td>
                      </tr>
                    </table>
                  </Col>
                )}
              </Row>
            </div>
          )}
          <div className="w-full flex justify-end">
            <button
              type="button"
              className="py-2 px-4 rounded bg-red-600 text-white active:bg-red-800 hover:bg-red-700"
              onClick={() => setIsDeleteModalVisible(true)}
            >
              Delete
            </button>
          </div>

          <Modal
            title="Confirm Delete"
            open={isDeleteModalVisible}
            onOk={handleDelete}
            confirmLoading={deleteLoading}
            onCancel={() => setIsDeleteModalVisible(false)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <p>Are you sure you want to delete this ticket?</p>
          </Modal>
        </Cards>
      </>
    </div>
  );
};

export default TicketDetail;
