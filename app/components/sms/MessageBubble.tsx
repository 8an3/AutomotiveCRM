import React, { Component, PureComponent } from 'react';
import PropTypes from "prop-types";
import WhatsappIcon from "./WhatsappIcon";
import ChatIcon from "./ChatIcon";

class MessageBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasMedia: this.props.message.type === "media",
      mediaDownloadFailed: false,
      mediaUrl: null,
      type: null,
    };
  }

  componentDidMount = async () => {
    this.setState({
      type: (await this.props.message.getMember()).type,
    });

    if (this.state.hasMedia) {
      this.props.message.media.getContentUrl()
        .then(url => this.setState({ mediaUrl: url }))
        .catch(e => this.setState({ mediaDownloadFailed: true }));
    }

    document.getElementById(this.props.message.sid).scrollIntoView({ behavior: "smooth" });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    document.getElementById(this.props.message.sid).scrollIntoView({ behavior: "smooth" });
  }

  render = () => {
    const { itemStyle, divStyle } = this.props.direction === "incoming"
      ? { itemStyle: styles.received_msg, divStyle: styles.received_withd_msg }
      : { itemStyle: styles.outgoing_msg, divStyle: styles.sent_msg };

    const m = this.props.message;
    const type = this.state.type;

    return (
      <li id={m.sid} className={itemStyle}>
        <div className={divStyle}>
          <div>
            <strong>
              {type === "whatsapp" &&
                <span role="img" aria-label="whatsapp icon">📱</span>
              }
              {type === "chat" &&
                <span role="img" aria-label="chat icon">💬</span>}
              {type === "sms" && <span role="img" aria-label="sms icon">📲</span>}
              {` ${m.author}`}
            </strong>
            <br />
            <div className={styles.medias}>
              {this.state.hasMedia &&
                <Media hasFailed={this.state.mediaDownloadFailed} url={this.state.mediaUrl} />}
            </div>
            {m.body}
          </div>
          <span className={styles.time_date}>{m.timestamp.toLocaleString()}</span>
        </div>
      </li>
    );
  }
}

class Media extends PureComponent {
  render = () => {
    const { hasFailed, url } = this.props;
    return (
      <div
        className={`${styles.media}${!url ? " " + styles.placeholder : ""}`}
        onClick={() => {
          if (url) {
            // Handle custom modal or lightbox for media preview
            // You can use a state variable to manage modal visibility
            alert("Implement your own media preview");
          }
        }}>

        {!url && !hasFailed && <div className={styles.spinner}></div>}

        {hasFailed &&
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span role="img" aria-label="warning icon">⚠️</span>
            <p>Failed to load media</p>
          </div>
        }

        {!hasFailed && url &&
          <div className={styles.media_icon}>
            <div className={styles.picture_preview} style={{ backgroundImage: `url(${url})` }}>
              <span role="img" aria-label="eye icon" className={styles.eyeIcon}>👁️</span>
            </div>
          </div>
        }
      </div>
    );
  }
}

Media.propTypes = {
  hasFailed: PropTypes.bool.isRequired,
  url: PropTypes.string
};

export default MessageBubble;
