import { makeStyles } from "@material-ui/core/styles";
import Header from "../../components/header";
import Box from "@material-ui/core/Box";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";

const useStyles = makeStyles((theme) => ({
  example: {
    color: "#ccc",
  },
  cardGrid: {
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 10,
  },
  cardMedia: {
    paddingTop: "0%",
  },
}));

const Category = ({ products, categories }) => {
  const classes = useStyles();
  const router = useRouter();

  if (router.isFallback) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Header data={categories} />
      <main>
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={1}>
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${encodeURIComponent(product.slug)}`}
              >
                <Grid item xs={6} sm={4} md={3}>
                  <Card
                    className={classes.card}
                    elevation={5}
                    variant="outlined"
                  >
                    <CardMedia className={classes.cardMedia}>
                      <div>
                        <Image
                          src={product.product_image[0].image}
                          title={product.title}
                          alt={product.product_image[0].alt_text}
                          width="100%"
                          height="100%"
                          layout="responsive"
                          objectFit="contain"
                        />
                      </div>
                    </CardMedia>
                    <CardContent>
                      <Typography gutterBottom component="div" variant="h5">
                        <Link
                          key={product.id}
                          href={`/product/${encodeURIComponent(product.slug)}`}
                          // href={`product/${encodeURIComponent(product.id)}`}
                        >
                          <a
                            style={{
                              color: "inherit",
                              textDecoration: "inherit",
                            }}
                          >
                            {product.title}
                          </a>
                        </Link>
                      </Typography>
                      <Box component="div" fontSize={20} fontWeight={700}>
                        <div style={{ color: "maroon" }}>
                          ₹{product.discount_price}
                          <del
                            style={{
                              color: "grey",
                              fontSize: 16,
                              padding: 3,
                            }}
                          >
                            ₹{product.regular_price}
                          </del>
                          <div
                            style={{
                              color: "black",
                              fontSize: 15,
                              fontWeight: 600,
                            }}
                          >
                            Save: ₹
                            {Number(product.regular_price) -
                              Number(product.discount_price)}
                            (
                            {(
                              ((Number(product.regular_price) -
                                Number(product.discount_price)) /
                                Number(product.regular_price)) *
                              100
                            ).toFixed(0)}
                            %)
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Link>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [{ params: { slug: "shoes" } }],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/categories/${params.slug}`
  );
  const products = await res.json();

  const ress = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/categories`
  );
  const categories = await ress.json();

  return {
    props: {
      products,
      categories,
    },
    revalidate: 60,
  };
}

export default dynamic(() => Promise.resolve(Category), { ssr: false });
