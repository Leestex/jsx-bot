# Concept

### Input

```jsx
const message = (
  <Message recipient="1905720572" notification="SILENT_PUSH">
    <Text>Hello, {user.firstName}!</Text>
    <Attachment>{images.welcome}</Attachment>
    <QuickReply>Show menu</QuickReply>
    <QuickReply>Change language</QuickReply>
    <QuickReply>Authorize</QuickReply>
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
        title: 'Show menu'
      },
      {
        content_type: 'text',
        title: 'Change language'
      },
      {
        content_type: 'text',
        title: 'Authorize'
      }
    ],
  },
  notification_type: 'SILENT_PUSH'
}
```

# Examples

### Facebook Messenger

```jsx
/** @jsx JSXBot */

import request from 'request'
import JSXBot from 'jsx-bot'
import { Message } from 'jsx-bot/facebook'

const user = {
  id: '1905720572',
  firstName: 'Nazar'
}

const commands = {
  start: 'CMD_START',
  language: 'CMD_LANG',
  auth: 'CMD_AUTH'
}

const images = {
  welcome: 'http://imagehosting.com/welcome.jpg'
}

const message = (
  <Message recipient={user.id} notification="SILENT_PUSH">
    <Message.Text>Hello, {user.firstName}!</Message.Text>
    <Message.Attachment payload={images.welcome} type="image" />
    <Message.QuickReply payload={commands.start}>Show menu</Message.QuickReply>
    <Message.QuickReply payload={commands.language}>Change language</Message.QuickReply>
    <Message.QuickReply payload={commands.auth}>Authorize</Message.QuickReply>
  </Message>
)

request.post('https://graph.facebook.com/v2.6/me/messages', {
  qs: { access_token: process.env.FB_ACCESS_TOKEN },
  json: message
})
```
