import React from 'react';
import moment from 'moment';
import process from 'reddit-text-js';

import Inbox from '../components/Inbox';

import mobilify from '../../lib/mobilify';

const subredditRegex = /\/r\/([^/]*)/;

class MessagePreview extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (nextProps !== this.props || nextState !== this.state);
  }

  render () {
    let message = this.props.message;
    let props = this.props;

    let submitted = moment(message.created_utc * 1000);
    let formattedSubmitted;

    if (submitted.diff(moment(), 'days')) {
      formattedSubmitted = submitted.format('l');
    } else {
      formattedSubmitted = submitted.format('LT');
    }

    let readClass = message.new ? ' message-unread' : '';
    let isMine = message.author === props.user.name;

    let authorClass = isMine ? ' message-mine' : '';

    let context;
    let subreddit;
    let reply;

    let link = message.context || `/message/messages/${message.name}`;

    let type = 'Direct message';

    if (message.parent_id) {
      if (message.parent_id.indexOf('t1') === 0) {
        type = 'Post reply';
      } else if (message.parent_id.indexOf('t3') === 0) {
        type = 'Comment reply';
      }
    }

    if (message.link_title) {
      if (message.subreddit) {
        subreddit = message.subreddit;
      } else if (message.context) {
        subreddit = message.context.match(subredditRegex)[1];
      }

      context = (
        <h3 className='message-title'>
          <a href={ link }>
            { `In ${subreddit} post: "${message.link_title}"` }
          </a>
        </h3>
      );
    } else if (message.subreddit) {
      context = (
        <h3 className='message-title'>
          <a href={ `/r/${ message.subreddit }` }>
            { `r/${message.subreddit}` }
          </a>
        </h3>
      );
    }

    if (!message.context && !message.replies && props.lastReply) {
      reply = (
        <a href={ link } className='btn btn-xs btn-primary'>Reply</a>
      );
    }

    let author;

    if (isMine) {
      author = (
        <h4 className='message-author message-mine'>
          <a href={ link }>
            { `Sent to ${message.dest}` }
          </a>
        </h4>
      );
    } else {
      let distinguished = message.distinguished ? ' text-' + message.distinguished : '';

      author = (
        <h4 className='message-author'>
          <a href={ link }>
            { `${type} from `}
            <span className={ distinguished }>{ `${message.author}` }</span>
          </a>
        </h4>
      );
    }

    let replies;

    if (message.replies && message.replies.length > 0) {
      replies = (
        <div className='col-xs-11 col-xs-offset-1'>
          <Inbox
            isReply={true}
            messages={message.replies}
            user={this.props.user}
            token={this.props.token}
            api={this.props.api}
          />
        </div>
      );
    }

    return (
      <article className={'panel message-preview' + readClass}>
        <div className='panel-body'>
          <div className='row'>
            <div className='col-xs-12'>
              <time dateTime={ submitted.format() } className='text-muted pull-right text-right'>
                { formattedSubmitted }
              </time>

              { author }
              { context }
            </div>
          </div>

          <div className='row'>
            <div className='col-xs-12'>
              <div className='message-body vertical-spacing-top' dangerouslySetInnerHTML={{
                __html: process(message.body)
              }} />

            </div>

            { replies }

            <div className='col-xs-12'>
              { reply }
            </div>
          </div>
        </div>
      </article>
    );
  }
}

export default MessagePreview;
