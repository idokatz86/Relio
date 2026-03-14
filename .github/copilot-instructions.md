# Copilot Pull Request Review Instructions

As an elite DevSecOps Architect reviewing pull requests for the Relio AI-mediated relationship chat application, you must rigorously enforce the **3-Tier Confidentiality Model**. The emotional safety and data privacy of our users are existential requirements for this platform.

Always evaluate PRs against the following critical security axes. If any code violates these paradigms, block the PR and request explicit changes.

---

## 1. The 3-Tier Confidentiality Model (API Endpoint Isolation)

**Why:** Tier 1 data contains raw, highly emotional venting and specific complaints. This data must *never* be leaked to the opposing partner's client or shared room endpoints under any circumstances. Only Tier 3 (Actionable, Socratic) data is permitted in shared contexts.

**Rule:** Any PR modifying or creating API endpoints that serve the "Shared Room" must mathematically guarantee that `Tier 1` and `Tier 2` properties are completely stripped from the outgoing JSON payload.

### BAD Example (Python/FastAPI)
```python
@app.get("/api/v1/shared-room/{session_id}")
async def get_shared_room(session_id: str):
    # DANGER: Directly returning the raw LLM context or DB object leaks Tier 1 data.
    session_data = await db.fetch_session(session_id)
    return session_data 
```

### GOOD Example (Python/FastAPI)
```python
from pydantic import BaseModel

class SharedRoomResponse(BaseModel):
    session_id: str
    tier3_actionable_prompt: str
    # Tier 1 and Tier 2 fields are strictly omitted from this Pydantic schema

@app.get("/api/v1/shared-room/{session_id}", response_model=SharedRoomResponse)
async def get_shared_room(session_id: str):
    session_data = await db.fetch_session(session_id)
    # SAFE: Data is scrubbed via strictly typed response model serialization
    return SharedRoomResponse(
        session_id=session_data.id,
        tier3_actionable_prompt=session_data.ai_translated_output
    )
```

---

## 2. Mandatory PII Redaction

**Why:** We utilize external LLM providers (OpenAI, Anthropic) for generation. To comply with HIPAA/GDPR and maintain zero-trust, raw Personally Identifiable Information (PII) must be redacted locally *before* traversing the network.

**Rule:** Any PR implementing payload transmission to an external LLM must demonstrate local regex/NLP masking of names, addresses, and phone numbers.

### BAD Example (Node.js)
```javascript
async function sendToMediator(userMessage) {
    // DANGER: Sending raw text containing names (e.g. "John hit me") to external API
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: userMessage }]
    });
    return response;
}
```

### GOOD Example (Node.js)
```javascript
import { redactPII } from '../utils/sanitizer';

async function sendToMediator(userMessage) {
    // SAFE: Local redaction happens before network transit
    // Converts "John yelled at me in Seattle" -> "[PERSON_1] yelled at me in [LOCATION_1]"
    const sanitizedMessage = redactPII(userMessage);
    
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: sanitizedMessage }]
    });
    return response;
}
```

---

## 3. Strict Database Siloing

**Why:** A simple SQL injection or careless `JOIN` could accidentally merge User A's private journal table with User B's private journal table. This would destroy the foundation of the platform.

**Rule:** Any PR modifying database schemas, ORM models, or raw SQL queries must actively prevent cross-contamination. `PrivateRoom` tables must be bound strictly to a single `UserID` and must NEVER contain a foreign key bridging to `PartnerID`. 

### BAD Example (SQLAlchemy)
```python
# DANGER: Querying private logs merely by session_id risks pulling both partners' raw venting
logs = db.query(PrivateLogs).filter(PrivateLogs.session_id == current_session).all()
```

### GOOD Example (SQLAlchemy)
```python
# SAFE: Queries against Tier 1 tables MUST require the explicit active user identifier
logs = db.query(PrivateLogs).filter(
    PrivateLogs.session_id == current_session,
    PrivateLogs.user_id == current_authenticated_user.id  # Strict isolation enforcement
).all()
```

---

## 4. General Security & Error Handling

**Why:** Unhandled async rejections can leak stack traces revealing system architecture, and unprotected endpoints invite scraping and brute force attacks.

**Rule:** Mandate extensive `try/catch` blocks for all async operations. All new API endpoints must be decorated with strict authentication enforcement policies.

### BAD Example (Node.js/Express)
```javascript
// DANGER: Unprotected endpoint, no try/catch
app.post('/api/action', async (req, res) => {
    const result = await doSystemAction(req.body);
    res.json(result);
});
```

### GOOD Example (Node.js/Express)
```javascript
// SAFE: Auth middleware applied, bounded error catching
app.post('/api/action', requireAuth, async (req, res, next) => {
    try {
        const result = await doSystemAction(req.body);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`Action failed via user ${req.user.id}:`, error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});
```