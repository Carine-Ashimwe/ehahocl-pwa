import {
    Input
} from "reactstrap";
const DataEnteries = ({ setDataSize, refetch }: { setDataSize: any; refetch: any }) => {

    return (
        <Input
            type="select"
            className="custom-select w-5"
            onChange={(event: any) => {
                setDataSize(event.target.value)
            }}
        >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
        </Input>
    )
}

export default DataEnteries