import React, {useEffect, useState} from "react";
import styles from './Table.module.css';
import 'antd/dist/antd.css';
import {Table as TableAnt, Input} from "antd";

const Table = (props) => {

    const [data, setData] = useState(props.data);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    useEffect(() => {
        if (props.data.length > 0) {
            columnsInit(getDataDate());
            rowsInit();
        }
    }, [props.data, data]);

    /*
    * Method searches the user's date to initialize the current month.
    * */
    const getDataDate = () => {
        for (const user of data) {
            if (user.Days) {
                let month = new Date(user.Days[0].Date);
                return new Date(month.getFullYear(), month.getMonth(), 1);
            }
        }
    };

    /*
    * Method initializes columns by current month for Table.
    * */
    const columnsInit = (currentMonth) => {
        try {
            let month = currentMonth.getMonth();

            const pad = (number) => {
                if (number < 10) {
                    return '0' + number;
                }
                return number;
            };

            setColumns([{
                title: "User",
                dataIndex: "Fullname",
                key: "Fullname",
                fixed: "left",
                sorter: (a, b) => a.Fullname.localeCompare(b.Fullname)
            }]);

            while (currentMonth.getMonth() === month) {
                let value = currentMonth.getFullYear() +
                    '-' + pad(currentMonth.getMonth() + 1) +
                    '-' + pad(currentMonth.getDate());
                let title = currentMonth.getDate();
                setColumns((prevColumns) => [...prevColumns,
                    {
                        title: title,
                        dataIndex: value,
                        key: value,
                        sorter: (a, b) => (a[value + "diff"] ?? 0) - (b[value + "diff"] ?? 0)
                    },
                ]);
                currentMonth.setDate(currentMonth.getDate() + 1);
            }

            setColumns((prevColumns) =>
                [
                    ...prevColumns,
                    {
                        title: "Monthly",
                        dataIndex: "monthlyTotal",
                        key: "monthlyTotal",
                        fixed: "right",
                        sorter: (a, b) => a.monthlyTotalNum - b.monthlyTotalNum,
                        render: (text) => (
                            <div style={{width: 85}}>
                                {text}
                            </div>
                        ),
                    }
                ]);
        } catch (err) {
        }
    };

    /*
   * Method initializes rows by data for Table.
   * */
    const rowsInit = () => {
        try {
            setRows([]);
            for (const item of data) {
                let row = {};
                let totalTime = 0;
                row.Fullname = item.Fullname;
                row.key = item.id;
                for (const el of item.Days) {
                    let diff = getDateDifference(getDate(el.End), getDate(el.Start));
                    row[el.Date] = getHoursAndMinutesByDay(diff);
                    row[el.Date + "diff"] = diff;
                    totalTime += diff;
                }
                row.monthlyTotal = getHoursAndMinutes(totalTime);
                row.monthlyTotalNum = totalTime;
                setRows(prevRows => [...prevRows, row]);
            }
        } catch (err) {
        }
    };

    /*
    * Method turns string 'hh-mm' into Date object.
    * */
    const getDate = (str) => {
        const date = str.split('-');
        const hours = date[0];
        const minutes = date[1];
        return new Date(0, 0, 0, hours, minutes);
    };

    /*
    * Method returns difference between two Date objects.
    * */
    const getDateDifference = (firstDate, secondDate) => {
        return firstDate - secondDate;
    };

    /*
    * Method turn milliseconds into string format 'hh:mm'
    * */
    const getHoursAndMinutes = (millis) => {
        const hours = Math.floor((millis) / 3600000);
        const minutes = Math.round((millis % 3600000) / 60000);
        return hours + ":" + minutes;
    };

    /*
    * Method turn milliseconds into string format 'hh:mm' by day
    * */
    const getHoursAndMinutesByDay = (millis) => {
        const hours = Math.floor((millis % 86400000) / 3600000);
        const minutes = Math.round(((millis % 86400000) % 3600000) / 60000);
        return hours + ":" + minutes;
    };

    /*
    * filter data by input value
    * */
    const filterList = (e) => {
        const filteredList = props.data.filter(item => item.Fullname.toLowerCase().search(e.target.value.toLowerCase()) !== -1);
        if (filteredList.length === 0) {
            setColumns([]);
        }
        setData(filteredList);
    };

    if (!props.dataIsLoaded) {
        return <h1>Загрузка таблицы...</h1>;
    }

    return (
        <>
            <Input type={"text"}
                   placeholder={"search user"}
                   onChange={filterList}
                   style={{
                       marginBottom: '.5rem',
                       maxWidth: "10rem"
                   }}
            />

            <TableAnt
                columns={columns}
                dataSource={rows}
                bordered={true}
                size={"middle"}
                tableLayout={"auto"}
                scroll={{
                    x: true,
                    y: 675
                }}
            >
            </TableAnt>
        </>
    );
};

export default Table;
