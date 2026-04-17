import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Tabs } from '../../components/ui/Tabs';
import { useAppContext } from '../../app/AppProvider';
import type { ImportType } from '../../mock/types';
import { Badge } from '../../components/ui/Badge';

export function BulkUploadPage() {
  const { importJobs, createImportJob, pushToast } = useAppContext();
  const [tab, setTab] = useState<ImportType>('product');
  const [fileName, setFileName] = useState('');

  const latest = useMemo(() => importJobs.find((job) => job.type === tab), [importJobs, tab]);

  return (
    <div className="page-grid">
      <PageHeader title="Bulk Upload" subtitle="Simulate CSV or Excel imports for products, stock, and prices." />
      <Card>
        <Tabs value={tab} onChange={setTab} items={[{ value: 'product', label: 'Product Upload' }, { value: 'stock', label: 'Stock Upload' }, { value: 'price', label: 'Price Upload' }]} />
      </Card>
      <div className="two-col">
        <Card>
          <CardHeader title="Upload Area" subtitle="Simulated import flow with validation feedback" />
          <div className="stack">
            <Input placeholder={`Enter ${tab} file name`} value={fileName} onChange={(event) => setFileName(event.target.value)} />
            <div className="inline-row">
              <Button variant="secondary" onClick={() => pushToast(`${tab} template downloaded`)}>Download Template</Button>
              <Button onClick={() => createImportJob(tab, fileName || `${tab}_upload_demo.csv`)}>Start Import</Button>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Validation Result" />
          {latest ? (
            <div className="stack">
              <div className="list-item"><span>Status</span><Badge label={latest.status} tone={latest.status === 'completed' ? 'success' : latest.status === 'failed' ? 'danger' : 'warning'} /></div>
              <div className="list-item"><span>Success rows</span><strong>{latest.successRows}</strong></div>
              <div className="list-item"><span>Failed rows</span><strong>{latest.failedRows}</strong></div>
              <Button variant="ghost" onClick={() => pushToast('Mock error report downloaded')}>Download Error Report</Button>
            </div>
          ) : null}
        </Card>
      </div>
      <Card>
        <CardHeader title="Import History" />
        <Table columns={['Job', 'Type', 'Created At', 'Status', 'Success', 'Failed']}>
          {importJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.fileName}</td>
              <td>{job.type}</td>
              <td>{job.createdAt}</td>
              <td><Badge label={job.status} tone={job.status === 'completed' ? 'success' : job.status === 'failed' ? 'danger' : 'warning'} /></td>
              <td>{job.successRows}</td>
              <td>{job.failedRows}</td>
            </tr>
          ))}
        </Table>
      </Card>
      <Card>
        <CardHeader title="Error Summary" />
        <Table columns={['File', 'Row', 'Field', 'Message']}>
          {importJobs.flatMap((job) => job.errors.map((error, index) => ({ ...error, fileName: job.fileName, key: `${job.id}-${index}` }))).map((error) => (
            <tr key={error.key}>
              <td>{error.fileName}</td>
              <td>{error.row}</td>
              <td>{error.field}</td>
              <td>{error.message}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
