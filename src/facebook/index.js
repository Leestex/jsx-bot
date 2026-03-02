export const Message = ({ recipient, notification }, children) => {
  const message = {}
  children.forEach(child => {
    Object.keys(child).forEach(key => {
      if (Array.isArray(child[key]) && Array.isArray(message[key])) {
        message[key] = message[key].concat(child[key])
      } else {
        message[key] = child[key]
      }
    })
  })
  return { notification_type: notification, recipient: { id: recipient }, message }
}

export const Text = (params, children) => ({
  text: children.join(''),
})

export const Attachment = ({ type, payload, attachmentId }) => {
  if (!type) throw new Error('Attachment requires a "type" prop (image, video, audio, file)')
  const payloadObj = attachmentId ? { attachment_id: attachmentId } : { url: payload }
  return { attachment: { type, payload: payloadObj } }
}

export const QuickReply = ({ payload, contentType = 'text' }, children) => ({
  quick_replies: [{ content_type: contentType, title: children.join(''), payload }],
})

export const MetaData = (params, data) => ({
  metadata: data[0],
})

export const Button = ({
  type, url, payload, title,
}) => {
  const button = { type, title }
  if (type === 'web_url') button.url = url
  else if (type === 'postback') button.payload = payload
  return button
}

export const ButtonTemplate = ({ text }, children) => ({
  attachment: {
    type: 'template',
    payload: { template_type: 'button', text, buttons: children },
  },
})

export const GenericTemplate = (params, children) => ({
  attachment: {
    type: 'template',
    payload: { template_type: 'generic', elements: children },
  },
})

export const Element = ({ title, subtitle, imageUrl }, children) => {
  const el = { title, subtitle }
  if (imageUrl) el.image_url = imageUrl
  if (children && children.length) el.buttons = children
  return el
}

export const SenderAction = ({ recipient, action }) => ({
  recipient: { id: recipient },
  sender_action: action,
})

Message.Text = Text
Message.Attachment = Attachment
Message.QuickReply = QuickReply
Message.MetaData = MetaData
Message.Button = Button
Message.ButtonTemplate = ButtonTemplate
Message.GenericTemplate = GenericTemplate
Message.Element = Element
Message.SenderAction = SenderAction
