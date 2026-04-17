import { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader } from '../../components/ui/Card';
import { Drawer } from '../../components/ui/Drawer';
import { useAppContext } from '../../app/AppProvider';
import type { Announcement } from '../../mock/types';

export function AnnouncementsPage() {
  const { announcements, markAnnouncementRead } = useAppContext();
  const [selected, setSelected] = useState<Announcement | null>(null);

  const openAnnouncement = (announcement: Announcement) => {
    setSelected(announcement);
    markAnnouncementRead(announcement.id);
  };

  return (
    <div className="page-grid">
      <PageHeader title="Announcements" subtitle="Pinned updates, unread states, and critical notices." />
      <Card>
        <CardHeader title="Announcement List" />
        <div className="stack">
          {[...announcements].sort((a, b) => Number(b.pinned) - Number(a.pinned)).map((announcement) => (
            <button className="announcement-row" key={announcement.id} onClick={() => openAnnouncement(announcement)}>
              <div>
                <div className="inline-row">
                  <strong>{announcement.title}</strong>
                  {announcement.pinned ? <Badge label="Pinned" tone="info" /> : null}
                  {announcement.critical ? <Badge label="Critical" tone="danger" /> : null}
                  {!announcement.read ? <Badge label="Unread" tone="warning" /> : null}
                </div>
                <p>{announcement.summary}</p>
              </div>
              <small>{announcement.date}</small>
            </button>
          ))}
        </div>
      </Card>
      <Drawer open={Boolean(selected)} title={selected?.title ?? 'Announcement'} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="stack">
            <div className="inline-row">
              {selected.tags.map((tag) => <Badge key={tag} label={tag} tone={tag === 'critical' ? 'danger' : 'info'} />)}
            </div>
            <p>{selected.body}</p>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
