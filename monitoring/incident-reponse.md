# Incident Response Protocol

This document outlines the basic procedures for handling alerts and incidents for the DevOps Assessment application.

## 1. Triage

When an alert fires in the `#alerts-devops` Slack channel:

1. **Acknowledge:** The on-call engineer acknowledges the alert with a thread reply (e.g., "👀 Looking into this.").
2. **Assess Impact:** Quickly determine the user-facing impact.
    * **Critical (e.g., `HostDown`, `HighErrorRate`):** The application is likely down or severely degraded. This is a
      P1 incident.
    * **Warning (e.g., `HighCpuUsage`, `HighRequestLatency`):** The application is degraded or at risk of becoming
      unavailable. This is a P2 incident.
3. **Declare Incident:** For P1 incidents, immediately create a dedicated incident channel (e.g.,
   `#incident-2025-09-26-high-error-rate`).

## 2. Investigation Playbook (Example)

#### Playbook: `HighRequestLatency`

This playbook is triggered when the P95 latency for the application exceeds 300ms.

1. **Check Grafana Dashboard:**
    * Open the main application dashboard.
    * Observe the "Request Latency (P95)" panel. Is the spike ongoing or has it resolved?
    * Check the "Request Rate" and "Error Rate" panels. Is there a correlation with increased traffic or errors?
    * Review host metrics: Is CPU, memory, or I/O saturated on the VM?

2. **Inspect Application Logs:**
    * SSH into the server.
    * Check the application container logs for errors or slow query warnings.
   ```bash
   docker logs --since 5m devops-app
   ```

3. **Check for Resource Contention:**
    * Use `docker stats` to see if the `devops-app` container is hitting its resource limits (if any are set).
    * Use `htop` on the host to check for other noisy neighbor processes consuming resources.

4. **Hypothesize Cause:**
    * *Hypothesis 1:* A recent deployment introduced a slow database query.
    * *Hypothesis 2:* A surge in traffic is overwhelming the server resources.
    * *Hypothesis 3:* An external dependency (e.g., a third-party API) is slow.

## 3. Resolution

* **Mitigation:** The first priority is to stop the user impact. This might mean rolling back a recent deployment,
  scaling up the server, or temporarily disabling a feature.
* **Fix:** Once mitigated, work on the root cause.
* **Verification:** Confirm that the alerting metric has returned to normal and the alert has resolved.

## 4. Post-Incident

* **Blameless Postmortem:** For every P1 and P2 incident, a postmortem is required.
    * **Goal:** To understand the root cause and prevent recurrence, not to assign blame.
    * **Template:**
        * **Summary:** What happened? What was the impact? How long did it last?
        * **Timeline:** Detailed, timestamped log of events from detection to resolution.
        * **Root Cause Analysis:** A deep dive into the technical and process-related causes.
        * **Action Items:** Specific, measurable, achievable, relevant, and time-bound (SMART) tasks to prevent this
          class of problem from happening again.