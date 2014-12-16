function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

function leftPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetLeft + leftPosition(domElt.offsetParent);
}

module.exports = function (React) {
  if (React.addons && React.addons.InfiniteScroll) {
    return React.addons.InfiniteScroll;
  }
  React.addons = React.addons || {};
  var InfiniteScroll = React.addons.InfiniteScroll = React.createClass({
    getDefaultProps: function () {
      return {
        pageStart: 0,
        hasMore: false,
        loadMore: function () {},
        threshold: 250
      };
    },
    componentDidMount: function () {
      this.pageLoaded = this.props.pageStart;
      this.attachScrollListener();
    },
    componentDidUpdate: function () {
      this.attachScrollListener();
    },
    render: function () {
      var props = this.props;
      var component = props.component || React.DOM.div;

      return component(props, props.children, props.hasMore && (props.loader || InfiniteScroll._defaultLoader));
    },
    scrollListener: function () {
      var el = this.getDOMNode();
      var vertical = this.props.vertical !== undefined ? this.props.vertical : true;
      var scrollBegin = null;
      var scrollLengt = null;
      if (vertical) {
        scrollBegin = el.parentNode.scrollTop;
        scrollLength = el.parentNode.clientHeight;
      } else {
        scrollBegin = el.parentNode.scrollLeft;
        scrollLength = el.parentNode.clientWidth;
      }
      if (scrollLength - scrollBegin < Number(this.props.threshold)) {
        this.detachScrollListener();
        // call loadMore after detachScrollListener to allow
        // for non-async loadMore functions
        this.props.loadMore(++this.pageLoaded);
      }
    },
    attachScrollListener: function () {
      if (!this.props.hasMore) {
        return;
      }
      var domNode = this.getDOMNode();
      var parentNode = domNode.parentNode;
      parentNode.addEventListener('scroll', this.scrollListener);
      parentNode.addEventListener('resize', this.scrollListener);
      this.scrollListener();
    },
    detachScrollListener: function () {
      window.removeEventListener('scroll', this.scrollListener);
      window.removeEventListener('resize', this.scrollListener);
    },
    componentWillUnmount: function () {
      this.detachScrollListener();
    }
  });
  InfiniteScroll.setDefaultLoader = function (loader) {
    InfiniteScroll._defaultLoader = loader;
  };
  return InfiniteScroll;
};
