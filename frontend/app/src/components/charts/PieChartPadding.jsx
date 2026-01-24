import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';


export default function PieChartWithPaddingAngle({ client, loan, emi }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log("Client:", client);
        console.log("Loan:", loan);
        console.log("EMI:", emi);
    
        const formattedData = [
            { label: 'Clients', value: client || 0 },
            { label: 'Loans', value: loan || 0 },
            { label: 'EMI', value: emi || 0 },
        ];
    
        setData(formattedData);
    }, [client, loan, emi]);

    return (
        <>
            {data.length > 0 && (
                <Stack direction="row">
                    <PieChart
                        series={[
                            {
                                paddingAngle: 5,
                                innerRadius: 60,
                                outerRadius: 80,
                                data,
                            },
                        ]}
                        margin={{ right: 5 }}
                        width={200}
                        height={210}
                        legend={{ hidden: true }}
                    />
                </Stack>
            )}
        </>
    );
}
