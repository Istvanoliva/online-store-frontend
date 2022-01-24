import React from 'react';
import PropTypes from 'prop-types';

class CardFav extends React.Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      produto: {},
      loading: false,
      productQuantity: 1,
      notAvailable: false,
    };
  }

  componentDidMount() {
    this.montaArray();
  }

  handleClick(event) {
    const { name } = event.target;
    const { productQuantity, produto: { available_quantity: available } } = this.state;
    const prevState = productQuantity;
    if (name === 'add' && prevState < available) {
      this.setState({ productQuantity: prevState + 1 }, () => {
        const { productQuantity: quantity } = this.state;
        if (quantity === available) this.setState({ notAvailable: true });
      });
    } else if (prevState > 0) this.setState({ productQuantity: prevState - 1 });
  }

   removeItem = (event) => {
     const { func } = this.props;
     const cartIds = JSON.parse(localStorage.getItem('cartIds'));
     const filterIds = cartIds.filter((id) => id !== event.target.id);
     localStorage.setItem('cartIds', JSON.stringify(filterIds));
     func();
   }

    montaArray = () => {
      const { product } = this.props;
      this.setState({ loading: false }, () => {
        /* const product = await getProductDetails(id); */
        this.setState({
          produto: product,
          loading: true,
        });
      });
    }

    render() {
      const { loading, produto, productQuantity, notAvailable } = this.state;
      return (
        <main>
          { loading && (
            <div>
              <p data-testid="shopping-cart-product-name">{produto.title}</p>
              <div>
                <button
                  data-testid="product-decrease-quantity"
                  type="button"
                  name="sub"
                  onClick={ this.handleClick }
                >
                  -
                </button>
                <p data-testid="shopping-cart-product-quantity">{productQuantity}</p>
                <button
                  data-testid="product-increase-quantity"
                  type="button"
                  name="add"
                  onClick={ this.handleClick }
                  disabled={ notAvailable }
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={ this.removeItem }
                  id={ produto.id }
                >
                  x
                </button>
                { notAvailable && <span>Não há mais em estoque</span> }
              </div>
            </div>)}
        </main>
      );
    }
}

CardFav.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  func: PropTypes.func.isRequired,
};

export default CardFav;
