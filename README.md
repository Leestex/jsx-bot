# Usage

### Input

```jsx
/** @jsx messenger */

import { messenger } from 'jsx-bot'

const message = (
  <Message recipient="1905720572" notification="SILENT_PUSH">
    <Message.Text>Hello, {user.firstName}!</Message.Text>
    <Message.Attachment payload={images.welcome} type="image" />
    <Message.QuickReply payload={commands.start}>Show menu</Message.QuickReply>
    <Message.QuickReply payload={commands.language}>Change language</Message.QuickReply>
    <Message.QuickReply payload={commands.auth}>Authorize</Message.QuickReply>
    <Message.Metadata>{meta.welcome}</Message.Metadata>
  </Message>
)
```

### Output

```javascript
const message = {
  recipient: {
    id: '1905720572'
  },
  message: {
    text: `Hello, ${user.firstName}!`,
    attachment: {
      type: 'image',
      payload: {
        url: images.welcome
      },
    },
    quick_replies: [
      {
        content_type: 'text',
        title: 'Show menu',
        payload: commands.start
      },
      {
        content_type: 'text',
        title: 'Change language',
        payload: commands.language
      },
      {
        content_type: 'text',
        title: 'Authorize',
        payload: commands.auth
      }
    ],
    metadata: meta.welcome
  },
  notification_type: 'SILENT_PUSH'
}
```
