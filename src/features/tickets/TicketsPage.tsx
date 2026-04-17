import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Drawer } from '../../components/ui/Drawer';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { useAppContext } from '../../app/AppProvider';
import type { Ticket, TicketCategory } from '../../mock/types';

export function TicketsPage() {
  const { tickets, createTicket, addTicketMessage } = useAppContext();
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TicketCategory>('operations');
  const [message, setMessage] = useState('');

  const filtered = useMemo(
    () => tickets.filter((ticket) => (category === 'all' || ticket.category === category) && (status === 'all' || ticket.status === status)),
    [tickets, category, status],
  );

  return (
    <div className="page-grid">
      <PageHeader title="Support Tickets" subtitle="Open and track vendor support issues." actionLabel="Create Ticket" onAction={() => setOpen(true)} />
      <Card>
        <CardHeader title="Filters" />
        <div className="filters">
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {['finance', 'operations', 'technical', 'catalog'].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            {['open', 'pending', 'resolved', 'closed'].map((item) => <option key={item}>{item}</option>)}
          </Select>
        </div>
      </Card>
      <Card>
        <CardHeader title="Ticket List" />
        <div className="stack">
          {filtered.map((ticket) => (
            <button className="announcement-row" key={ticket.id} onClick={() => setSelected(ticket)}>
              <div>
                <div className="inline-row">
                  <strong>{ticket.title}</strong>
                  <Badge label={ticket.category} tone="info" />
                  <Badge label={ticket.status} tone={ticket.status === 'open' ? 'warning' : ticket.status === 'resolved' ? 'success' : 'default'} />
                </div>
                <p>{ticket.messages[ticket.messages.length - 1]?.text}</p>
              </div>
              <small>{ticket.updatedAt}</small>
            </button>
          ))}
        </div>
      </Card>
      <Modal open={open} title="Create Support Ticket" onClose={() => setOpen(false)}>
        <div className="stack">
          <Input placeholder="Ticket title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Select value={newCategory} onChange={(event) => setNewCategory(event.target.value as TicketCategory)}>
            {['finance', 'operations', 'technical', 'catalog'].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Button onClick={() => { createTicket({ title, category: newCategory }); setOpen(false); setTitle(''); }}>Submit Ticket</Button>
        </div>
      </Modal>
      <Drawer open={Boolean(selected)} title={selected?.title ?? 'Ticket'} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="stack">
            <div className="inline-row">
              <Badge label={selected.category} tone="info" />
              <Badge label={selected.status} tone="warning" />
            </div>
            <div className="thread">
              {selected.messages.map((item, index) => (
                <div key={index} className={`message ${item.sender === 'vendor' ? 'message-vendor' : ''}`}>
                  <strong>{item.sender}</strong>
                  <p>{item.text}</p>
                  <small>{item.date}</small>
                </div>
              ))}
            </div>
            <Textarea rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Reply to ticket" />
            <Button onClick={() => { addTicketMessage(selected.id, message); setMessage(''); }}>Send Message</Button>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
