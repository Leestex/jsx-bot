import assign from 'object-assign-deep'

export const Message = ({ recipient, notification }, children) => {
  const result = {
    notification_type: notification,
    recipient,
    message: {},
  }

  children.forEach(child => assign.withOptions(result.message, [child], { arrayBehaviour: 'merge' }))

  return result
}

export const Text = (params, children) => ({
  text: children.join(''),
})

export const Attachment = ({ type, payload }) => ({
  attachment: { type, payload: { url: payload } },
})

export const QuickReply = ({ payload }, title) => ({
  quick_replies: [{ content_type: 'text', title: title[0], payload }],
})

export const MetaData = (params, data) => ({
  metadata: data[0],
})

Message.Text = Text
Message.Attachment = Attachment
Message.QuickReply = QuickReply
Message.MetaData = MetaData
