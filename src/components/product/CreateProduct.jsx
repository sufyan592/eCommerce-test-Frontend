import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    pictures: [],
  });

  const [errors, setErrors] = useState({});

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (formData.pictures.length + acceptedFiles.length > 6) {
        alert("You can only upload up to 6 pictures.");
        return;
      }
      const newPictures = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFormData((prevData) => {
        const updatedPictures = [...prevData.pictures, ...newPictures];
        return {
          ...prevData,
          pictures: updatedPictures,
        };
      });
    },
  });

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters long";
    if (!formData.price || isNaN(formData.price))
      newErrors.price = "Price is required and must be a number";
    if (!formData.quantity || isNaN(formData.quantity))
      newErrors.quantity = "Quantity is required and must be a number";
    if (formData.pictures.length < 1 || formData.pictures.length > 6)
      newErrors.pictures = "You must upload between 1 and 6 pictures";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (file) => {
    setFormData((prevData) => {
      const updatedPictures = prevData.pictures.filter((f) => f !== file);
      URL.revokeObjectURL(file.preview);
      return {
        ...prevData,
        pictures: updatedPictures,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    formData.pictures.forEach((file) => data.append("pictures", file));

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/product/create`,
        data
      );
      console.log("res", res);
      if (res?.data?.status === 201) {
        toast.success("products Added");
        setFormData({
          name: "",
          price: "",
          quantity: "",
          pictures: [],
        });
      }
    } catch (error) {
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 2,
        boxShadow: 3,
        marginLeft: 2,
        marginRight: 2,
        background: "#f5f5dcbf",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Add Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
          </Grid>
          <Grid item xs={12}>
            {formData.pictures.length < 6 && (
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed rgba(0, 0, 0, 0.87)",
                  borderRadius: "8px",
                  padding: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  marginBottom: 2,
                }}
              >
                <input {...getInputProps()} />
                <Typography>
                  Drag 'n' drop some images here, or click to select images
                </Typography>
              </Box>
            )}
            {errors.pictures && (
              <Typography color="error">{errors.pictures}</Typography>
            )}
            {formData.pictures.length > 0 && (
              <Box>
                {formData.pictures.length > 0 && (
                  <Box sx={{ width: "100%", mb: 2 }}>
                    <Card sx={{ maxWidth: "100%" }}>
                      <CardMedia
                        component="img"
                        image={formData.pictures[0].preview}
                        alt="Main"
                        sx={{ height: 400, objectFit: "cover" }}
                      />
                    </Card>
                  </Box>
                )}
                <Grid container spacing={2}>
                  {formData.pictures.slice(1).map((file, index) => (
                    <Grid item xs={4} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          image={file.preview}
                          alt={`Gallery Image ${index}`}
                          sx={{ height: 100, objectFit: "cover" }}
                        />
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <IconButton onClick={() => handleDelete(file)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Toaster />
    </Box>
  );
};

export default CreateProduct;
