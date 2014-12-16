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
      this.updateOuterLength();
    },
    componentDidUpdate: function () {
      this.attachScrollListener();
      this.updateOuterLength();
    },
    updateOuterLength: function () {
      var innerLength = this.props.innerLength;
      if (!innerLength) {
        return;
      }
      var el = this.getDOMNode();
      var length = innerLength * React.Children.count(this.props.children) + 'px';
      if (this.isVertical()) {
        el.style.height = length;
      } else {
        el.style.width = length;
      }
    },
    isVertical: function() {
      return this.props.vertical !== undefined ? this.props.vertical : true;
    },
    render: function () {
      var props = this.props;
      var component = props.component || React.DOM.div;
      return component(props, props.children, props.hasMore && (props.loader || InfiniteScroll._defaultLoader));
    },
    scrollListener: function () {
      var el = this.getDOMNode();
      var scrollBegin = null;
      var scrollLengt = null;
      if (this.isVertical()) {
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
