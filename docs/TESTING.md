# Test Plan

## Audio streaming & WebSocket
- Verify chunks received continuously for a 5+ minute session
- Ensure live_score_update within 3 seconds after chunk send
- Confirm connection stability and reconnection behavior

## AI responses
- Validate JSON parse success from Gemini (or stub) >95% in tests
- Evaluate question relevance subjectively (target >= 4/5)

## UI/UX
- Responsive layouts across desktop/tablet/mobile
- Keyboard navigation and focus states for accessibility

## Database
- Integrity across foreign keys
- Seed multiple users and presentations and verify query performance
