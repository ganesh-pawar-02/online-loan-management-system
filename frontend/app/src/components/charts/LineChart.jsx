import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const BiaxialLineChart = ({ transactionData }) => {
  const [creditedData, setCreditedData] = React.useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [debitedData, setDebitedData] = React.useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  React.useEffect(() => {
    if (transactionData) {
      const newCreditedData = [...creditedData];
      const newDebitedData = [...debitedData];

      transactionData.forEach(transaction => {
        const month = new Date(transaction.date).getMonth();
        if (transaction.type === 'add') {
          newCreditedData[month] += transaction.amount;
        } else if (transaction.type === 'withdraw') {
          newDebitedData[month] += transaction.amount;
        }
      });

      setCreditedData(newCreditedData);
      setDebitedData(newDebitedData);
    }
  }, [transactionData]);

  return (
    <LineChart
      width={900}
      height={333}
      series={[
        { data: creditedData, label: 'Credited', yAxisId: 'leftAxisId', color: '#9B1C80' },
        { data: debitedData, label: 'Debited', yAxisId: 'rightAxisId', color: '#1E90FF' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
      rightAxis="rightAxisId"
    />
  );
};

export default BiaxialLineChart;