import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/api/settings';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { Setting } from '@/types';

// ─── Per-group editable state ─────────────────────────────────────────────────

interface SettingGroupCardProps {
  group: string;
  settings: Setting[];
}

function SettingGroupCard({ group, settings }: SettingGroupCardProps) {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  // Initialise local state from server values
  useEffect(() => {
    const initial: Record<string, string> = {};
    settings.forEach((s) => { initial[s.key] = s.value ?? ''; });
    setValues(initial);
  }, [settings]);

  const mutation = useMutation({
    mutationFn: () =>
      settingsApi.batchUpsert(
        settings.map((s) => ({
          key: s.key,
          value: values[s.key] ?? '',
          type: s.type,
          group: s.group,
        })),
      ),
    onSuccess: () => {
      toast.success(`"${group}" settings saved`);
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderInput = (setting: Setting) => {
    const value = values[setting.key] ?? '';

    if (setting.type === 'boolean') {
      return (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id={setting.key}
            checked={value === 'true' || value === '1'}
            onChange={(e) => handleChange(setting.key, e.target.checked ? 'true' : 'false')}
            className="h-4 w-4"
          />
          <label htmlFor={setting.key} className="text-sm cursor-pointer">
            {value === 'true' || value === '1' ? 'Enabled' : 'Disabled'}
          </label>
        </div>
      );
    }

    if (setting.type === 'integer') {
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => handleChange(setting.key, e.target.value)}
          className="max-w-xs"
        />
      );
    }

    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => handleChange(setting.key, e.target.value)}
        className="max-w-md"
      />
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base capitalize">
              <Settings2 size={16} />
              {group.replace(/_/g, ' ')}
            </CardTitle>
            <CardDescription className="mt-1">
              {settings.length} setting{settings.length !== 1 ? 's' : ''} in this group
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? <Loader2 size={14} className="animate-spin" />
              : <Save size={14} />
            }
            Save
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          {settings.map((setting, idx) => (
            <div key={setting.key}>
              {idx > 0 && <Separator className="my-4" />}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(200px,1fr)_2fr] sm:items-start sm:gap-6 py-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-xs font-mono font-medium bg-muted px-1.5 py-0.5 rounded">
                      {setting.key}
                    </code>
                    <Badge variant="outline" className="text-xs">{setting.type}</Badge>
                  </div>
                  {setting.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {setting.description}
                    </p>
                  )}
                </div>
                <div>{renderInput(setting)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-24 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-64" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => settingsApi.list(),
  });

  // Group settings by their `group` field
  const grouped = (settings ?? []).reduce<Record<string, Setting[]>>((acc, s) => {
    const key = s.group ?? 'general';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const groups = Object.keys(grouped).sort();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure application settings and feature flags"
      />

      <div className="mt-4 space-y-6">
        {isLoading ? (
          <SettingsSkeleton />
        ) : groups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No settings found.
            </CardContent>
          </Card>
        ) : (
          groups.map((group) => (
            <SettingGroupCard
              key={group}
              group={group}
              settings={grouped[group]}
            />
          ))
        )}
      </div>
    </div>
  );
}
