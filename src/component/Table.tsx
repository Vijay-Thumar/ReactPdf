import Datatable from "@kruti2502/custom-react-datatable";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import debounce from "../uitiity/debounce";

interface ColumnType {
    key: keyof (typeof rows)[0];
    label: string;
    minWidth?: string;
}

interface RowType {
    id: number;
    first_name: string;
    last_name: string;
}

const rows: RowType[] = [
    {
        id: 1,
        first_name: "Rufus",
        last_name: "Jolin",
    },
    {
        id: 2,
        first_name: "Bondon",
        last_name: "Reasce",
    },
    {
        id: 3,
        first_name: "Davin",
        last_name: "Towlson",
    },
    {
        id: 4,
        first_name: "Barnebas",
        last_name: "Ferraraccio",
    },
];

const columns: ColumnType[] = [
    { key: "id", label: "ID" },
    { key: "first_name", label: "First name", minWidth: "500" },
    { key: "last_name", label: "Last name" },
];

const Table = () => {
    const componentPDF = useRef<HTMLDivElement>(null)
    const [image, setImage] = useState<any>()
    const onPdfClickHandler = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: 'UserData',
        onAfterPrint: () => alert('PDF is saved')
    })

    const onTextChange = debounce(convertToImage, 200)

    useEffect(() => {
        console.log('Some data has been changed!')
    }, [document.getElementById('myTable')])

    function convertToImage(e: any) {
        console.log(e.target.value)
        var htmlContent = document.getElementById('myTable');

        if (!htmlContent) {
            console.log('html content is not there!')
            return
        }

        // Use html2canvas library to capture the HTML content
        html2canvas(htmlContent).then(function (canvas) {
            // Convert the canvas to a data URL
            var dataURL = canvas.toDataURL('image/png');

            // Create an image element
            var img = new Image();

            // Set the source of the image to the data URL
            img.src = dataURL;
            setImage(dataURL)

            // Append the image to the body or any other container
            // document.body.appendChild(img);
        });
    }

    return <div onChange={()=>{console.log('executed changes')}} onClick={()=>{console.log('click executed')}}>
        <div id="myTable" ref={componentPDF} style={{ width: "100%" }}>
            <Datatable
                {...{ columns, rows }}
                sortable
                paginator
                noOfRowsPerPage={8}
                resizableColumns
                draggable
                filterable
                defaultCheckedCols={["id", "first_name", "last_name"]}
                maxHeight={"1000"}
                headerColor={"#3cb371"}
                evenRowColor={"rgb(250, 250, 250)"}
                oddRowColor={"rgb(240, 240, 240)"}
                showGridLines
            />
            <textarea onChange={onTextChange} title="bodyArea" id="w3review" name="w3review" rows={4} cols={50}>
            </textarea>
        </div>
        <br />
        <br />
        <br />
        <button onClick={onPdfClickHandler}>PDF</button>
        <button onClick={convertToImage}> test</button>
        {image ? <img src={image} alt="imga" style={{ width: '500px' }} /> : null}
    </div>
}

export default Table;