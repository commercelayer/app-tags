import { ErrorNotFound } from '#pages/ErrorNotFound'
import { TagEdit } from '#pages/TagEdit'
import { TagList } from '#pages/TagList'
import { TagNew } from '#pages/TagNew'
import {
  CoreSdkProvider,
  ErrorBoundary,
  PageSkeleton,
  TokenProvider
} from '@commercelayer/app-elements'
import { SWRConfig } from 'swr'
import { Redirect, Route, Router, Switch } from 'wouter'
import { appRoutes } from './data/routes'

const isDev = Boolean(import.meta.env.DEV)

export function App(): JSX.Element {
  const basePath =
    import.meta.env.PUBLIC_PROJECT_PATH != null
      ? `/${import.meta.env.PUBLIC_PROJECT_PATH}`
      : undefined

  return (
    <ErrorBoundary hasContainer>
      <SWRConfig
        value={{
          revalidateOnFocus: false
        }}
      >
        <TokenProvider
          appSlug='tags'
          kind='tags'
          domain={window.clAppConfig.domain}
          reauthenticateOnInvalidAuth={!isDev}
          loadingElement={<PageSkeleton />}
          devMode={isDev}
        >
          <CoreSdkProvider>
            <Router base={basePath}>
              <Switch>
                <Route path={appRoutes.home.path}>
                  <Redirect to={appRoutes.list.path} />
                </Route>
                <Route path={appRoutes.list.path}>
                  <TagList type='all' />
                </Route>
                <Route path={appRoutes.new.path}>
                  <TagNew />
                </Route>
                <Route path={appRoutes.edit.path}>
                  <TagEdit />
                </Route>
                <Route>
                  <ErrorNotFound />
                </Route>
              </Switch>
            </Router>
          </CoreSdkProvider>
        </TokenProvider>
      </SWRConfig>
    </ErrorBoundary>
  )
}
