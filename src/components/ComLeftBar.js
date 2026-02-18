import axios from 'axios'
import { Component } from 'react'
import { Col, ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faCoffee, faCheese } from '@fortawesome/free-solid-svg-icons'

const Icon = ({ nama }) => {
    if (nama === "Makanan") return <FontAwesomeIcon icon={faUtensils} className="mr-2" />
    if (nama === "Minuman") return <FontAwesomeIcon icon={faCoffee} className="mr-2" />
    if (nama === "Camilan") return <FontAwesomeIcon icon={faCheese} className="mr-2" />
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
        const url = "https://web-production-80a65.up.railway.app/categorylist";
        axios
            .get(url) 
            .then(res => {
                // alert("categorylist")
                // alert(JSON.stringify(res.data))
                const categories = res.data;
                this.setState({ categories });
            })

            // handle success
            .catch(error => {
                alert("Error get data category dari API")
            })
    }

    render() {
        //console.log("Response: ", this.state.categories);
        const { categories } = this.state
        const { changeCategory, categoryYangDipilih } = this.props
        return (
            <div>
                
            <Col md={2} className='mt-3'>
                <h4><strong>Daftar Kategori</strong></h4>
                <hr />
                <ListGroup as="ul">
                    {categories && categories.map((category) => (
                        <ListGroup.Item as="li" key={category.CatID} 
                        onClick={() =>{changeCategory(category.Nama)}}
                        className={categoryYangDipilih === category.nama && "category-aktif"}
                        style={{cursor:'pointer'}}
                        >
                            <h5>
                                <Icon nama={category.Nama} /> {category.Nama}
                            </h5>
                        </ListGroup.Item>
                    ))}

                </ListGroup>
            </Col>

             </div>
        )
    }
}

