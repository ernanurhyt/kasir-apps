import axios from 'axios'
import { Component } from 'react'
import { Col, Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faCoffee, faCheese, faList } from '@fortawesome/free-solid-svg-icons'

const Icon = ({ nama }) => {
    if (nama === "Makanan") return <FontAwesomeIcon icon={faUtensils} className="mr-1" size="sm" />
    if (nama === "Minuman") return <FontAwesomeIcon icon={faCoffee} className="mr-1" size="sm" />
    if (nama === "Camilan") return <FontAwesomeIcon icon={faCheese} className="mr-1" size="sm" />
    return null;
}

export default class ComLeftBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: []
        }
    }

    componentDidMount() {
        const url = "http://localhost:8000/categorylist";
        axios
            .get(url) 
            .then(res => {
                const categories = res.data;
                this.setState({ categories });
            })
            .catch(error => {
                alert("Error get data category dari API")
            })
    }

    render() {
        const { categories } = this.state
        const { changeCategory, categoryYangDipilih } = this.props
        
        // Cari nama kategori yang dipilih
        const selectedCategory = categories.find(cat => cat.Nama === categoryYangDipilih)
        const selectedLabel = selectedCategory ? selectedCategory.Nama : "Pilih Kategori"

        return (
            <Col md={12} className='mt-2'>
                <Dropdown>
                    <Dropdown.Toggle 
                        variant="light" 
                        size="sm" 
                        className="w-100 text-dark"
                        style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}
                    >
                        <FontAwesomeIcon icon={faList} className="mr-1 text-dark" /> 
                        <span className="text-dark">{selectedLabel}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100">
                        {categories && categories.map((category) => (
                            <Dropdown.Item 
                                key={category.CatID}
                                onClick={() => changeCategory(category.Nama)}
                                active={categoryYangDipilih === category.Nama}
                                className="text-dark"
                            >
                                <Icon nama={category.Nama} /> <span className="text-dark">{category.Nama}</span>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        )
    }
}