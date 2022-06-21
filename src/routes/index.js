import authRouter from './auth/auth.router';

const AuthRoutes = (app) => {
  app.use(authRouter.routePrefix, authRouter.route());
};

export default AuthRoutes;
