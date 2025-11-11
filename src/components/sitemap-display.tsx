/**
 * Sitemap Display Component
 * Shows all routes and their SEO metadata
 * Useful for debugging and verifying sitemap generation
 */

import { APP_ROUTES } from '@/lib/sitemap-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const changefreqColors: Record<string, string> = {
  always: 'bg-red-100 text-red-800',
  hourly: 'bg-orange-100 text-orange-800',
  daily: 'bg-yellow-100 text-yellow-800',
  weekly: 'bg-blue-100 text-blue-800',
  monthly: 'bg-purple-100 text-purple-800',
  yearly: 'bg-gray-100 text-gray-800',
  never: 'bg-slate-100 text-slate-800',
};

export function SitemapDisplay() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Sitemap Routes</CardTitle>
          <CardDescription>
            All routes included in the XML sitemap for SEO indexing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-2 font-semibold">Path</th>
                  <th className="pb-2 font-semibold">Priority</th>
                  <th className="pb-2 font-semibold">Change Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {APP_ROUTES.map((route, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="py-3 font-mono text-sm">{route.path}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full"
                            style={{
                              width: `${(route.priority || 0.5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="font-semibold">
                          {(route.priority || 0.5).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        className={`${
                          changefreqColors[route.changefreq || 'weekly'] || changefreqColors.weekly
                        }`}
                      >
                        {route.changefreq || 'weekly'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
            <p>
              <strong>Total Routes:</strong> {APP_ROUTES.length}
            </p>
            <p>
              <strong>Sitemap Location:</strong> <code className="bg-muted px-2 py-1 rounded">/public/sitemap.xml</code>
            </p>
            <p className="mt-2">
              The sitemap is automatically generated during the build process and updated whenever routes change.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
