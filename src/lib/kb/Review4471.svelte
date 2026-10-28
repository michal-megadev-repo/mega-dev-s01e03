<script lang="ts">
  import { rawRows, mergedReports, groups, originalCounts, exceptions, unplaced, weeklyQueue } from '#lib/kb/review-4471';
  import { causeOf } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  let { section = 'groups' }: {section?: 'groups' | 'exceptions' | 'queue'} = $props();
</script>

{#if section === 'groups'}
  <p><strong>{rawRows.length}</strong> exported rows · <strong>{mergedReports.length}</strong> unique reports · <strong>{rawRows.length-mergedReports.length}</strong> repeated rows removed by report ID.</p>
  <table>
    <thead><tr><th>Problem / investigation</th><th>Reports</th><th>Tenants</th><th>Received dates</th></tr></thead>
    <tbody>{#each groups as g}<tr><td>{g.label}</td><td>{g.count}</td><td>{g.tenants}</td><td>{g.first} → {g.last}</td></tr>{/each}</tbody>
    <tfoot><tr><th>Total, disjoint groups</th><td>{groups.reduce((n,g)=>n+g.count,0)}</td><td colspan="2">{unplaced.length} unplaced</td></tr></tfoot>
  </table>
  <p>The export classifier yields {originalCounts.map(g=>`${g.cause}: ${g.count} (${g.exceptions} flagged cases included)`).join('; ')}. The table above shows disjoint work queues after holding flagged cases out for investigation, not a claim that they establish another shared cause.</p>
{:else if section === 'exceptions'}
  <p>Keep these cases visible and separate from the parser fix. They are one investigation queue; a common root cause is unverified.</p>
  {#each exceptions as r}
    <article>
      <h3>{r.id} · {r.tenant} · {r.channel}</h3>
      <blockquote>{r.body}</blockquote>
      <p>Received <code>{r.receivedAt}</code>; merged <code>{r.mergedAt}</code>. Previously filed as <code>{causeOf(r,tenantOf(r))}</code>.</p>
    </article>
  {/each}
{:else}
  <table>
    <thead><tr><th>Week starting</th><th>Received</th><th>Merged</th></tr></thead>
    <tbody>{#each weeklyQueue as w}<tr><td>{w.week}</td><td>{w.received}</td><td>{w.merged}</td></tr>{/each}</tbody>
  </table>
  <p>Calendar dates come from each original timestamp, as in QueueTimeline. A merge is an administrative event, not a fix or resolution.</p>
{/if}

<style>
  article { border-left:3px solid var(--warn); padding-left:1rem; margin:1.5rem 0; }
  article h3 { margin-bottom:.4rem; font-size:1rem; }
  blockquote { margin:.5rem 0; }
  article p { font-size:.8rem; color:var(--muted); overflow-wrap:anywhere; }
</style>
