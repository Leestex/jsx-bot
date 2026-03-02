export const SlackMessage = ({ channel, text }, children) => ({
  channel,
  text: text || '',
  blocks: children,
})

export const Section = (params, children) => {
  const block = {
    type: 'section',
    text: { type: 'mrkdwn', text: children.join('') },
  }
  if (params && params.accessory) block.accessory = params.accessory
  return block
}

export const Divider = () => ({
  type: 'divider',
})

export const Image = ({ url, altText, title }) => {
  const block = {
    type: 'image',
    image_url: url,
    alt_text: altText || '',
  }
  if (title) block.title = { type: 'plain_text', text: title }
  return block
}

export const Actions = (params, children) => ({
  type: 'actions',
  elements: children,
})

export const SlackButton = ({
  actionId, value, style, url,
}, children) => {
  const button = {
    type: 'button',
    text: { type: 'plain_text', text: children.join('') },
    action_id: actionId,
  }
  if (value) button.value = value
  if (style) button.style = style
  if (url) button.url = url
  return button
}

export const Header = (params, children) => ({
  type: 'header',
  text: { type: 'plain_text', text: children.join('') },
})

export const Context = (params, children) => ({
  type: 'context',
  elements: children,
})

export const Mrkdwn = (params, children) => ({
  type: 'mrkdwn',
  text: children.join(''),
})

SlackMessage.Section = Section
SlackMessage.Divider = Divider
SlackMessage.Image = Image
SlackMessage.Actions = Actions
SlackMessage.Button = SlackButton
SlackMessage.Header = Header
SlackMessage.Context = Context
SlackMessage.Mrkdwn = Mrkdwn
