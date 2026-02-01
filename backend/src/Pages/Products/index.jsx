import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, useTheme } from "@mui/material";
import Menu from "@mui/material/Menu";
import { IoMdAdd } from "react-icons/io";
import Rating from '@mui/material/Rating';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Progress from "../../Components/ProgressBar";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import { FiDownload, FiUpload, FiFile } from "react-icons/fi";
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData, deleteMultipleData, postData } from '../../utils/api';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from '@mui/material/CircularProgress';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
    { id: "product", label: "PRODUCT", minWidth: 150 },
    { id: "category", label: "CATEGORY", minWidth: 100 },
    {
        id: "subcategory",
        label: "SUB CATEGORY",
        minWidth: 150,
    },
    {
        id: "price",
        label: "PRICE",
        minWidth: 130,
    },
    {
        id: "sales",
        label: "SALES",
        minWidth: 100,
    },
    {
        id: "stock",
        label: "STOCK",
        minWidth: 100,
    },
    {
        id: "rating",
        label: "RATING",
        minWidth: 100,
    },
    {
        id: "action",
        label: "ACTION",
        minWidth: 120,
    },
];

export const Products = () => {
    const [productCat, setProductCat] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const [productData, setProductData] = useState([]);
    const [productTotalData, setProductTotalData] = useState([]);

    const [productSubCat, setProductSubCat] = React.useState('');
    const [productThirdLavelCat, setProductThirdLavelCat] = useState('');
    const [sortedIds, setSortedIds] = useState([]);
    const [isLoading, setIsloading] = useState(false);

    const [pageOrder, setPageOrder] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const [photos, setPhotos] = useState([]);
    const [open, setOpen] = useState(false);

    const [exportAnchorEl, setExportAnchorEl] = useState(null);
    const [importAnchorEl, setImportAnchorEl] = useState(null);
    const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const fileInputRef = useRef(null);

    const context = useContext(MyContext);

    useEffect(() => {
        getProducts(page, rowsPerPage);
    }, [context?.isOpenFullScreenPanel, page, rowsPerPage])



    useEffect(() => {
        // Filter orders based on search query
        if (searchQuery !== "") {
            const filteredOrders = productTotalData?.totalProducts?.filter((product) =>
                product._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.catName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.subCat?.includes(searchQuery)
            );
            setProductData({
                error: false,
                success: true,
                products: filteredOrders,
                total: filteredOrders?.length,
                page: parseInt(page),
                totalPages: Math.ceil(filteredOrders?.length / rowsPerPage),
                totalCount: productData?.totalCount
            });

        } else {
            getProducts(page, rowsPerPage);
        }

    }, [searchQuery])


    // Handler to toggle all checkboxes
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        // Update all items' checked status
        const updatedItems = productData?.products?.map((item) => ({
            ...item,
            checked: isChecked,
        }));
        setProductData({
            error: false,
            success: true,
            products: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalCount: productData?.totalCount
        });

        // Update the sorted IDs state
        if (isChecked) {
            const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b);
            setSortedIds(ids);
        } else {
            setSortedIds([]);
        }
    };


    // Handler to toggle individual checkboxes
    const handleCheckboxChange = (e, id, index) => {

        const updatedItems = productData?.products?.map((item) =>
            item._id === id ? { ...item, checked: !item.checked } : item
        );
        setProductData({
            error: false,
            success: true,
            products: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalCount: productData?.totalCount
        });



        // Update the sorted IDs state
        const selectedIds = updatedItems
            .filter((item) => item.checked)
            .map((item) => item._id)
            .sort((a, b) => a - b);
        setSortedIds(selectedIds);
    };


    const getProducts = async (page, limit) => {
        
        setIsloading(true)
        fetchDataFromApi(`/api/product/getAllProducts?page=${page + 1}&limit=${limit}`).then((res) => {
            setProductData(res)

            setProductTotalData(res)
            setIsloading(false)

            let arr = [];

            for (let i = 0; i < res?.products?.length; i++) {
                arr.push({
                    src: res?.products[i]?.images?.[0] || '/icon.svg'
                })
            }

            setPhotos(arr);

        })
    }

    const handleChangeProductCat = (event) => {
        if (event.target.value !== null) {
            setProductCat(event.target.value);
            setProductSubCat('');
            setProductThirdLavelCat('');
            setIsloading(true)
            fetchDataFromApi(`/api/product/getAllProductsByCatId/${event.target.value}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });

                    setTimeout(() => {
                        setIsloading(false)
                    }, 300);
                }
            })
        } else {
            getProducts(0, 50);
            setProductSubCat('');
            setProductCat(event.target.value);
            setProductThirdLavelCat('');
        }

    };


    const handleChangeProductSubCat = (event) => {
        if (event.target.value !== null) {
            setProductSubCat(event.target.value);
            setProductCat('');
            setProductThirdLavelCat('');
            setIsloading(true)
            fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${event.target.value}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false)
                    }, 500);
                }
            })
        } else {
            setProductSubCat(event.target.value);
            getProducts(0, 50);
            setProductCat('');
            setProductThirdLavelCat('');
        }
    };

    const handleChangeProductThirdLavelCat = (event) => {
        if (event.target.value !== null) {
            setProductThirdLavelCat(event.target.value);
            setProductCat('');
            setProductSubCat('');
            setIsloading(true)
            fetchDataFromApi(`/api/product/getAllProductsByThirdLavelCat/${event.target.value}`).then((res) => {
                console.log(res)
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false)
                    }, 300);
                }
            })
        } else {
            setProductThirdLavelCat(event.target.value);
            getProducts(0, 50);
            setProductCat('');
            setProductSubCat('');
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const deleteProduct = (id) => {
        if (context?.userData?.role === "ADMIN") {
            deleteData(`/api/product/${id}`).then((res) => {
                getProducts();
                context.alertBox("success", "Product deleted");

            })
        } else {
            context.alertBox("error", "Only admin can delete data");
        }
    }


    const deleteMultipleProduct = () => {

        if (sortedIds.length === 0) {
            context.alertBox('error', 'Please select items to delete.');
            return;
        }


        try {
            deleteMultipleData(`/api/product/deleteMultiple`, {
                data: { ids: sortedIds },
            }).then((res) => {
                getProducts();
                context.alertBox("success", "Product deleted");
                setSortedIds([]);

            })

        } catch (error) {
            context.alertBox('error', 'Error deleting items.');
        }


    }

    const getProductsToExport = () => {
        const list = productData?.products || [];
        if (sortedIds?.length > 0) {
            return list.filter((p) => sortedIds.includes(p._id));
        }
        return list;
    };

    const escapeCsv = (v) => {
        const s = String(v == null ? '' : v);
        return '"' + s.replace(/"/g, '""') + '"';
    };

    const exportToCSV = () => {
        const products = getProductsToExport();
        if (!products.length) {
            context.alertBox('error', 'No products to export.');
            return;
        }
        const headers = ['name', 'description', 'brand', 'price', 'oldPrice', 'catName', 'subCat', 'thirdsubCat', 'countInStock', 'rating', 'discount', 'sale', 'images'];
        const rows = products.map((p) =>
            headers.map((h) => escapeCsv(Array.isArray(p[h]) ? (p[h] || []).join('|') : p[h])).join(',')
        );
        const csv = [headers.join(','), ...rows].join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `products_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
        context.alertBox('success', `Exported ${products.length} product(s) to CSV.`);
        setExportAnchorEl(null);
        setBulkAnchorEl(null);
    };

    const exportToJSON = () => {
        const products = getProductsToExport();
        if (!products.length) {
            context.alertBox('error', 'No products to export.');
            return;
        }
        const json = JSON.stringify(products, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `products_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
        context.alertBox('success', `Exported ${products.length} product(s) to JSON.`);
        setExportAnchorEl(null);
        setBulkAnchorEl(null);
    };

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        setImportFile(f || null);
        e.target.value = '';
        setImportAnchorEl(null);
    };

    const isTareeqalrahaFormat = (parsed) => {
        return Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0]) &&
            parsed[0].some((x) => x && typeof x === 'object' && ('title' in x || 'image link' in x));
    };

    const handleImportNow = async () => {
        if (!importFile) {
            context.alertBox('error', 'Please select a JSON file first.');
            return;
        }
        setImportLoading(true);
        try {
            const text = await importFile.text();
            const parsed = JSON.parse(text);
            if (isTareeqalrahaFormat(parsed)) {
                const CHUNK = 50;
                let totalImported = 0;
                for (let i = 0; i < parsed.length; i += CHUNK) {
                    const chunk = parsed.slice(i, i + CHUNK);
                    const res = await postData('/api/product/importTareeqalraha', { data: chunk });
                    if (!res?.success) {
                        context.alertBox('error', res?.message || 'Import failed.');
                        setImportLoading(false);
                        return;
                    }
                    totalImported += res.imported || 0;
                }
                context.alertBox('success', `Imported ${totalImported} product(s) from tareeqalraha.json.`);
                setImportFile(null);
                getProducts(0, rowsPerPage);
            } else {
                const arr = Array.isArray(parsed) ? parsed : (parsed?.products || []);
                if (!arr.length) {
                    context.alertBox('error', 'No products found in the JSON file.');
                    setImportLoading(false);
                    return;
                }
                const res = await postData('/api/product/import', { products: arr });
                if (res?.success) {
                    context.alertBox('success', res.message || `Imported ${res.imported} product(s).`);
                    setImportFile(null);
                    getProducts(page, rowsPerPage);
                } else {
                    context.alertBox('error', res?.message || 'Import failed.');
                }
            }
        } catch (err) {
            context.alertBox('error', err?.message || 'Invalid JSON or import failed.');
        }
        setImportLoading(false);
    };

    const handleBulkDelete = () => {
        setBulkAnchorEl(null);
        deleteMultipleProduct();
    };

    const handleSyncCategories = async () => {
        setSyncLoading(true);
        try {
            const res = await postData('/api/product/syncCategories', {});
            if (res?.error === false && res?.success) {
                context.alertBox('success', res.message || `Synced ${res.updated} product(s).`);
                getProducts(page, rowsPerPage);
            } else {
                context.alertBox('error', res?.message || 'Sync failed.');
            }
        } catch (e) {
            context.alertBox('error', e?.message || 'Sync failed.');
        }
        setSyncLoading(false);
    };

    const handleChangePage = (event, newPage) => {
        getProducts(page, rowsPerPage);
        setPage(newPage);
    };

    return (
        <>

            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">
                    Products{" "}
                    <span className="font-[400] text-[14px]"></span>
                </h2>

                <div className="col w-[75%] ml-auto flex items-center justify-end gap-2 flex-wrap">
                    <Button
                        className="btn-sm"
                        size="small"
                        variant="outlined"
                        onClick={handleSyncCategories}
                        disabled={syncLoading}
                    >
                        {syncLoading ? 'Syncing…' : 'Sync Categories'}
                    </Button>
                    <Button
                        className="btn-sm"
                        size="small"
                        variant="outlined"
                        startIcon={<FiDownload />}
                        onClick={(e) => setExportAnchorEl(e.currentTarget)}
                    >
                        Export
                    </Button>
                    <Menu anchorEl={exportAnchorEl} open={Boolean(exportAnchorEl)} onClose={() => setExportAnchorEl(null)}>
                        <MenuItem onClick={exportToCSV}>Export to CSV</MenuItem>
                        <MenuItem onClick={exportToJSON}>Export to JSON</MenuItem>
                    </Menu>

                    <Button
                        className="btn-sm"
                        size="small"
                        variant="outlined"
                        startIcon={<FiUpload />}
                        onClick={(e) => setImportAnchorEl(e.currentTarget)}
                    >
                        Import
                    </Button>
                    <Menu anchorEl={importAnchorEl} open={Boolean(importAnchorEl)} onClose={() => setImportAnchorEl(null)}>
                        <MenuItem onClick={() => { fileInputRef.current?.click(); }}>
                            <FiFile style={{ marginRight: 8, verticalAlign: 'middle' }} /> Select Your JSON Products File
                        </MenuItem>
                    </Menu>
                    <Button
                        className="btn-sm"
                        size="small"
                        variant="outlined"
                        startIcon={<FiFile />}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Select Your JSON Products File
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,application/json"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        className="btn-sm !bg-[#1565c0] !text-white"
                        size="small"
                        variant="contained"
                        startIcon={<IoMdAdd />}
                        onClick={handleImportNow}
                        disabled={!importFile || importLoading}
                    >
                        {importLoading ? 'Importing…' : 'Import Now'}
                    </Button>

                    <Button
                        className="btn-sm !bg-[#ed6c02] !text-white hover:!bg-[#e65100]"
                        size="small"
                        variant="contained"
                        onClick={(e) => setBulkAnchorEl(e.currentTarget)}
                    >
                        Bulk Action
                    </Button>
                    <Menu anchorEl={bulkAnchorEl} open={Boolean(bulkAnchorEl)} onClose={() => setBulkAnchorEl(null)}>
                        <MenuItem
                            onClick={handleBulkDelete}
                            disabled={!sortedIds?.length}
                        >
                            Delete
                        </MenuItem>
                        <MenuItem
                            onClick={() => { exportToCSV(); }}
                            disabled={!getProductsToExport().length}
                        >
                            Export to CSV
                        </MenuItem>
                        <MenuItem
                            onClick={() => { exportToJSON(); }}
                            disabled={!getProductsToExport().length}
                        >
                            Export to JSON
                        </MenuItem>
                    </Menu>

                    {
                        sortedIds?.length !== 0 && <Button variant="contained" className="btn-sm" size="small" color="error"
                            onClick={deleteMultipleProduct}>Delete</Button>
                    }

                    <Button className="btn-blue !text-white btn-sm"
                        onClick={() => context.setIsOpenFullScreenPanel({
                            open: true,
                            model: 'Add Product'
                        })}>Add Product</Button>
                </div>


            </div>


            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">

                <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-4 w-full px-5 justify-beetween gap-4">
                    <div className="col">
                        <h4 className="font-[600] text-[13px] mb-2">Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Select
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productCatDrop"
                                size="small"
                                className='w-full'
                                value={productCat}
                                label="Category"
                                onChange={handleChangeProductCat}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {
                                    context?.catData?.map((cat, index) => {
                                        return (
                                            <MenuItem value={cat?._id}>{cat?.name}</MenuItem>
                                        )
                                    })
                                }

                            </Select>
                        }
                    </div>


                    <div className="col">
                        <h4 className="font-[600] text-[13px] mb-2">Sub Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Select
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productCatDrop"
                                size="small"
                                className='w-full'
                                value={productSubCat}
                                label="Sub Category"
                                onChange={handleChangeProductSubCat}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {
                                    context?.catData?.map((cat, index) => {
                                        return (
                                            cat?.children?.length !== 0 && cat?.children?.map((subCat, index_) => {
                                                return (
                                                    <MenuItem value={subCat?._id}>
                                                        {subCat?.name}</MenuItem>
                                                )
                                            })

                                        )
                                    })
                                }

                            </Select>
                        }
                    </div>


                    <div className="col">
                        <h4 className="font-[600] text-[13px] mb-2">Third Level Sub Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Select
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productCatDrop"
                                size="small"
                                className='w-full'
                                value={productThirdLavelCat}
                                label="Sub Category"
                                onChange={handleChangeProductThirdLavelCat}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {
                                    context?.catData?.map((cat) => {
                                        return (
                                            cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                                                return (
                                                    subCat?.children?.length !== 0 && subCat?.children?.map((thirdLavelCat, index) => {
                                                        return <MenuItem value={thirdLavelCat?._id} key={index}
                                                        >{thirdLavelCat?.name}</MenuItem>
                                                    })

                                                )
                                            })

                                        )
                                    })
                                }

                            </Select>
                        }

                    </div>


                    <div className="col w-full ml-auto flex items-center">
                        <div style={{ alignSelf: 'end' }} className="w-full">
                            <SearchBox
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                setPageOrder={setPageOrder}
                            />
                        </div>
                    </div>

                </div>

                <br />
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox {...label} size="small"
                                        onChange={handleSelectAll}
                                        checked={productData?.products?.length > 0 ? productData?.products?.every((item) => item.checked) : false}
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {
                                isLoading === false ? productData?.products?.length !== 0 && productData?.products?.map((product, index) => {
                                    return (
                                        <TableRow key={index} className={product.checked === true ? '!bg-[#1976d21f]' : ''}>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <Checkbox {...label} size="small" checked={product.checked === true ? true : false}
                                                    onChange={(e) => handleCheckboxChange(e, product._id, index)}
                                                />
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex items-center gap-4 w-[300px]" title={product?.name}>
                                                    <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group cursor-pointer" onClick={() => setOpen(true)}>
                                                        <LazyLoadImage
                                                            alt={product?.name || 'product'}
                                                            effect="blur"
                                                            src={product?.images?.[0] || '/icon.svg'}
                                                            className="w-full group-hover:scale-105 transition-all"
                                                        />
                                                    </div>
                                                    <div className="info w-[75%]">
                                                        <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                            <Link to={`/product/${product?._id}`}>
                                                                {product?.name?.substr(0, 50) + '...'}
                                                            </Link>
                                                        </h3>
                                                        <span className="text-[12px]">{product?.brand}</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                {product?.catName}
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                {product?.subCat}
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex gap-1 flex-col">
                                                    <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                                        {product?.price?.toLocaleString('ar-AE', { style: 'currency', currency: 'AED' })}
                                                    </span>
                                                    <span className="price text-primary text-[14px]  font-[600]">
                                                        {product?.oldPrice?.toLocaleString('ar-AE', { style: 'currency', currency: 'AED' })}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className="text-[14px] w-[70px]">
                                                    <span className="font-[600]">{product?.sale}</span> sale
                                                </p>


                                            </TableCell>


                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className="text-[14px] w-[70px]">
                                                    <span className="font-[600] text-primary">{product?.countInStock}</span>
                                                </p>


                                            </TableCell>


                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className="text-[14px] w-[100px]">
                                                    <Rating name="half-rating" size="small" defaultValue={product?.rating} readOnly />
                                                </p>


                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex items-center gap-1">
                                                    <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]"
                                                        onClick={() => context.setIsOpenFullScreenPanel({
                                                            open: true,
                                                            model: 'Edit Product',
                                                            id: product?._id
                                                        })}
                                                    >
                                                        <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                    </Button>

                                                    <Link to={`/product/${product?._id}`}>
                                                        <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]">
                                                            <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    </Link>

                                                    <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]" onClick={() => deleteProduct(product?._id)}>
                                                        <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })


                                    :

                                    <>
                                        <TableRow>
                                            <TableCell colspan={8}>
                                                <div className="flex items-center justify-center w-full min-h-[400px]">
                                                    <CircularProgress color="inherit" />
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                    </>
                            }



                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[50, 100, 150, 200]}
                    component="div"
                    count={productData?.totalPages * rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>


            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={photos}
            />


        </>
    )
}

export default Products;
