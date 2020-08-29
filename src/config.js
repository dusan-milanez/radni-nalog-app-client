const dev = {
    //STRIPE_KEY: "YOUR_STRIPE_DEV_PUBLIC_KEY",
    s3: {
        REGION: "us-east-2",
        BUCKET: "radni-nalog-app-2-api-dev-attachmentsbucket-15235ixrxq6bz"
    },
    apiGateway: {
        REGION: "us-east-2",
        URL: "https://msosmjro4h.execute-api.us-east-2.amazonaws.com/dev"
    },
    cognito: {
        REGION: "us-east-2",
        USER_POOL_ID: "us-east-2_o0k6naVBU",
        APP_CLIENT_ID: "69jnrkfvbdfd622f7ttiijfkhd",
        IDENTITY_POOL_ID: "us-east-2:96d0f883-fd9f-415f-8dde-26a5c20d9aef"
    }
};

const prod = {
    //STRIPE_KEY: "YOUR_STRIPE_PROD_PUBLIC_KEY",
    s3: {
        REGION: "us-east-2",
        BUCKET: "radni-nalog-app-2-api-prod-attachmentsbucket-h5kz7naoqrif"
    },
    apiGateway: {
        REGION: "us-east-2",
        URL: "https://4wda09ibif.execute-api.us-east-2.amazonaws.com/prod"
    },
    cognito: {
        REGION: "us-east-2",
        USER_POOL_ID: "us-east-2_3qdK1mDVC",
        APP_CLIENT_ID: "4qpmrib2c6bm6dt4nep097hk14",
        IDENTITY_POOL_ID: "us-east-2:caa38e1b-d36e-4438-873b-c3df27e408dc"
    }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;

export default {
    // Add common config values here
    MAX_ATTACHMENT_SIZE: 5000000,
    ...config
};