import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Card, CardHeader, Col,
    Container, Row,
    Table
} from 'reactstrap';
import * as Yup from 'yup';
import PageHeader from '../../components/Headers/PageHeader';
import { ISensorData } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { GetSensorDatas } from '../api/sensors-data';
// layout for this page

// core components


const SensorDatas = () => {

    const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
        ["SensorDatas"],
        () => GetSensorDatas({ farm_id: 1, parameter_id: 1 })
    );

    const notify = (msg_type: string) => {
        if (msg_type === 'error') {
            toast.error(error?.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light'
            });
        }
    }

    useEffect(() => {
        if (isError) {
            notify('error')
        }
    }, [isError])

    const FormValidationSchema = Yup.object().shape({
        serial_number: Yup.string().trim().required().label('Serial Number'),
        description: Yup.string().trim().required().label('Description'),
    });

    return (
        <>
            <ToastContainer />
            <PageHeader page="Sensor Data" />
            {/* Page content */}
            <Container className="mt--7" fluid>

                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0" xl="12">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Sensor Data</h3>
                                    </div>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Farm</th>
                                        <th scope="col">Parameter</th>
                                        <th scope="col">Sensor SN</th>
                                        <th scope="col">Value</th>
                                        <th scope="col">Sensored time</th>
                                        <th scope="col">Created time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        isLoading ? (<td colSpan={3}>Loading available sensor data...</td>)
                                            : isError ? (<td colSpan={3}>{error.message}</td>)
                                                : isSuccess && data.data.length > 0 ? (
                                                    data.data.map((sensor_data: ISensorData, index: number) => (
                                                        <tr key={index}>
                                                            <td scope="row">{(index + 1)}</td>
                                                            <td scope="row">{(sensor_data.sensor.farm && (sensor_data.sensor.farm.farm_name)) || ("-")}</td>
                                                            <td scope="row">{sensor_data.parameter.name}</td>
                                                            <td scope="row">{sensor_data.sensor.serial_number}</td>
                                                            <td scope="row">{sensor_data.value} {sensor_data.parameter.unit}</td>
                                                            <td scope="row">{sensor_data.sensored_date}</td>
                                                            <td scope="row">{sensor_data.created_at}</td>
                                                        </tr>
                                                    ))
                                                )
                                                    : (<td colSpan={3}>No Sensor Data Available</td>)
                                    }
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

SensorDatas.layout = Admin;

export default SensorDatas;