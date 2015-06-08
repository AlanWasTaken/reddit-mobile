import React from 'react';
import moment from 'moment';

import MessagePreview from './MessagePreview';

class Inbox extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps !== this.props || nextState !== this.state);
  }

  render() {
    var props = this.props;
    var messages = props.messages;

    return (
      <div className={ 'Inbox' }>
        {
          messages.map(function(m, i) {
            return (
              <MessagePreview
                lastReply={ !props.isReply || props.isReply && (props.messages.length - 1) === i }
                user={props.user}
                key={'message-' + m.name}
                message={m}
              />
            );
          })
        }
      </div>
    );
  }
}

export default Inbox;
