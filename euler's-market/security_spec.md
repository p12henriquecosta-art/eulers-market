# Security Specification - Euler's Market

## Data Invariants
1. **Waiting List Integrity**: Anyone can join the waiting list, but only admins can change the status (e.g., from 'pending' to 'invited').
2. **User Isolation**: Users can only access their own private profile data.
3. **Admin Authority**: Only users with the 'admin' role can view aggregate analytics and the full waiting list.
4. **Immutability**: `createdAt` timestamps must be set by the server and never modified.

## The Dirty Dozen (Threat Vectors)
1. **Status Spoofing**: User tries to set their own waiting list status to 'invited' during creation.
2. **Identity Theft**: User tries to create a profile for a different UID.
3. **Analytics Scraping**: Unauthorized user tries to fetch the global totals from `/analytics/overview`.
4. **Waitlist Mass Delete**: Non-admin attempts to clear the `waiting_list` collection.
5. **Role Escalation**: User tries to update their own role from 'user' to 'admin'.
6. **Poisoned IDs**: Attacker sends a 1MB string as a document ID to exhaust resources.
7. **Timestamp Fraud**: User provides a past date for `createdAt` to jump the queue.
8. **Shadow Fields**: User adds hidden fields like `isBetaTester: true` to their document.
9. **Email Hijacking**: User tries to register with an email they don't own (prevented by Auth, but rules should verify `auth.token.email`).
10. **Query Scraping**: User tries to list all users via a blanket query.
11. **Relational Breakage**: User tries to create a subscription for a product that doesn't exist.
12. **PII Leak**: Admin stats exposure during a standard read.

## Test Runner (Logic Check)
The `firestore.rules` will be verified against these payloads.
- `ALLOW CREATE /waiting_list` IF `request.resource.data.status == 'pending'`.
- `DENY UPDATE /waiting_list` IF `!isAdmin()`.
- `ALLOW READ /users/{uid}` IF `request.auth.uid == uid`.
- `DENY READ /analytics/overview` IF `!isAdmin()`.
