import React, { Component } from 'react';
import api from "../../services/api";
import { Link } from 'react-router-dom';
import "./styles.css";

export default class Main extends Component {
    //Estado ao inves de ficar salvando coisas em variaveis
    state = {
        products: [],
        productInfo: {},
        page: 1,
    };

    //Método que é executado automaticamente pelo react assim que o componente é exibido em tela
    componentDidMount() {
        this.loadProducts();
    }

    //Quando se executa funcoes pertencentes ao react como o render, componentDidMount, é possível usar no formato namedFunctions, porém quando é uma funcao nossa, tem que ser arrowfunction pq se for funcao normal ela nao consegue enxergar o escopo da variavel this, já a arrowfunction nao sobrescreve o escopo do this, pra podermos acessar seu conteudo
    loadProducts = async (page = 1) => {
        const response  = await api.get(`/products?page=${page}`);
        const { docs, ...productInfo } = response.data;
        this.setState({ products: docs, productInfo, page }); //seta o conteudo do state
    };

    prevPage = () => {
        const { page } = this.state;

        if(page === 1) return;

        const pageNumber = page - 1;
        this.loadProducts(pageNumber);
    };

    nextPage = () => {
        const { page, productInfo } = this.state;
        if (page === productInfo.pages) return;

        const pageNumber = page + 1;
        this.loadProducts(pageNumber);
    };

    deleteProduct = async (id) => {
        console.log(`${id}`);
        const response  = await api.delete(`/products/${id}`);
        const { status } = response.status;
        if (status === 200) {
            alert('OK');
        }
        this.loadProducts(1);
    };

    //Metodo render fica sempre escutando a alteracao do "state", conforme ela é atualizada
    render() {
        const { products, page, productInfo } = this.state;

        return (
            <div className="product-list">
                <div className="crud-buttons">
                    <Link to={`product/`}>Adicionar Produto</Link>
                </div>
                {products.map(product => (
                    <article key={product._id}>
                        <strong>{product.title}</strong>
                        <button className="btn-exclude" onClick={() => this.deleteProduct(product._id)}>Excluir</button>
                        <p>{product.description}</p>
                        <Link to={`products/${product._id}`}>Acessar</Link>
                    </article>
                ))}
                <div className="actions">
                    <button disabled={page === 1} onClick={this.prevPage}>Anterior</button>
                    <button disabled={page === productInfo.pages} onClick={this.nextPage}>Próximo</button>
                </div>
            </div>
        )
    }
}

