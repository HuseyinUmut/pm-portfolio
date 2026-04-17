import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useAppContext } from '../../app/AppProvider';

export function FinancePage() {
  const { financeTransactions, payouts, pushToast } = useAppContext();
  const grossSales = financeTransactions.filter((item) => item.type === 'sale').reduce((sum, item) => sum + item.amount, 0);
  const commissions = Math.abs(financeTransactions.filter((item) => item.type === 'commission').reduce((sum, item) => sum + item.amount, 0));
  const netBalance = financeTransactions[financeTransactions.length - 1]?.balanceAfter ?? 0;
  const pendingPayout = payouts.find((item) => item.status === 'scheduled')?.amount ?? 0;

  return (
    <div className="page-grid">
      <PageHeader title="Finance" subtitle="Review balance, settlements, and transaction ledger." />
      <div className="stats-grid">
        <StatCard label="Gross Sales" value={`TRY ${grossSales.toFixed(2)}`} />
        <StatCard label="Commissions" value={`TRY ${commissions.toFixed(2)}`} />
        <StatCard label="Net Balance" value={`TRY ${netBalance.toFixed(2)}`} />
        <StatCard label="Pending Payout" value={`TRY ${pendingPayout.toFixed(2)}`} />
      </div>
      <Card>
        <CardHeader title="Ledger" />
        <Table columns={['Date', 'Order', 'Type', 'Description', 'Amount', 'Balance After']}>
          {financeTransactions.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.orderNumber ?? '-'}</td>
              <td>{item.type}</td>
              <td>{item.description}</td>
              <td className={item.amount < 0 ? 'text-danger' : 'text-success'}>{item.amount < 0 ? '-' : '+'}TRY {Math.abs(item.amount).toFixed(2)}</td>
              <td>TRY {item.balanceAfter.toFixed(2)}</td>
            </tr>
          ))}
        </Table>
      </Card>
      <Card>
        <CardHeader title="Payout History" />
        <Table columns={['Payout Date', 'Amount', 'Status', 'Settlement File']}>
          {payouts.map((item) => (
            <tr key={item.id}>
              <td>{item.payoutDate}</td>
              <td>TRY {item.amount.toFixed(2)}</td>
              <td>{item.status}</td>
              <td><Button variant="ghost" onClick={() => pushToast(`${item.settlementFile} downloaded`)}>{item.settlementFile}</Button></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
