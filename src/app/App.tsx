import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import 'shared/lib/i18n';
import './styles/index.css';

export type Link = {
  title: string,
  link: string
}

export type PodcastEpisode = {
  id: string;
  title: string;
  description: string;
  path_to_audio: string;
  links: Link[]
};

const App: React.FC = () => {

    return (<div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#e6e8e6'}}>
      <RouterProvider router={router} />
    </div>);
};

export default App;
