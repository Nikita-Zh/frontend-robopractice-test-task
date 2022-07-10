import React, {useEffect, useState} from "react";

const Table = (props) => {

    const [monthLength, setMonthLength] = useState(0);
    const [daysNums, setDaysNums] = useState([]);
    const [data, setData] = useState(props.data);

    useEffect(() => {
        if (props.dataIsLoaded) {
            getNumOfDays();
            columnsInit();
        }
    }, [props.dataIsLoaded, data, daysNums]);

    useEffect(() => {
        if (props.dataIsLoaded) {
            setData(props.data);
        }
    }, [props.data]);

    const getNumOfDays = () => {
        for (const user of data) {
            if (user.Days) {
                let month = new Date(user.Days[0].Date);
                let monthLen = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
                setMonthLength(monthLen);
                break;
            }
        }

    };

    const columnsInit = () => {
        let days = [];
        for (let i = 1; i <= monthLength; ++i) {
            days.push({
                id: "day" + i,
                num: i
            });
        }
        setDaysNums(days);
    };

    const setRowItem = (id, time) => {
        return {id, time};
    };

    const rowCreate = (el, name) => {
        const res = [];
        let index;
        let totalTime = 0;
        for (let i = 0; i < monthLength + 1; ++i) {
            res.push(setRowItem(name + i, 0));
        }

        if (monthLength > 0) {
            for (const item of el) {
                index = Number.parseInt(item.Date.slice(item.Date.length - 2));
                let dif = getDateDifference(getDate(item.End), getDate(item.Start));
                res[index - 1].time = getHoursAndMinutesByDay(dif);
                totalTime += dif;
            }
        }

        res[res.length - 1].time = getHoursAndMinutes(totalTime);
        return res;
    };

    const getDate = (str) => {
        const date = str.split('-');
        const hours = date[0];
        const minutes = date[1];
        return new Date(0, 0, 0, hours, minutes);
    };

    const getDateDifference = (firstDate, secondDate) => {
        return firstDate - secondDate;
    };

    const getHoursAndMinutes = (time) => {
        const hours = Math.floor((time) / 3600000);
        const minutes = Math.round((time % 3600000) / 60000);
        return hours + ":" + minutes;
    };

    const getHoursAndMinutesByDay = (time) => {
        const hours = Math.floor((time % 86400000) / 3600000);
        const minutes = Math.round(((time % 86400000) % 3600000) / 60000);
        return hours + ":" + minutes;
    };

    const filterList = (e) => {
        let filteredList = props.data.filter(item => item.Fullname.toLowerCase().search(e.target.value.toLowerCase()) !== -1);
        setData(filteredList);
    };

    if (!props.dataIsLoaded) {
        return <h1>Загрузка таблицы...</h1>;
    } else {
        return (
            <>
                <input type={"text"} placeholder={"search"} onChange={filterList}/>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        {daysNums.map((el) => (
                            <th key={el.id}>
                                {el.num}
                            </th>
                        ))}
                        <th>Monthly total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(el => (
                        <tr key={el.id}>
                            <td>{el.Fullname}</td>
                            {rowCreate(el.Days, el.Fullname).map(item => (
                                <td key={item.id}> {item.time} </td>
                            ))}
                            <td>{el.totalTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </>
        );
    }
};

export default Table;
