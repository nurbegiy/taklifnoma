import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvitationBySlug } from '../services/invitationService';
import { InvitationRenderer } from '../themes/index.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import NotFound from './NotFound.jsx';

export default function PublicInvitation() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, data: null, notFound: false });

  useEffect(() => {
    let mounted = true;
    getInvitationBySlug(slug).then(({ data, error }) => {
      if (!mounted) return;
      if (error || !data) {
        setState({ loading: false, data: null, notFound: true });
        return;
      }
      const merged = { ...data, photos: data.invitation_photos || [] };
      setState({ loading: false, data: merged, notFound: false });
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (state.loading) return <LoadingSpinner label="Taklifnoma ochilmoqda..." />;
  if (state.notFound) return <NotFound isInvitation />;

  return (
    <div className="public-wrap">
      <div className="public-frame">
        <InvitationRenderer data={state.data} />
      </div>

      <style>{`
        .public-wrap {
          width: 100%;
          min-height: 100vh;
          background: #0c0e13;
        }
        .public-frame {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
        }
        @media (min-width: 860px) {
          .public-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
          }
          .public-frame {
            max-width: 460px;
            max-height: calc(100vh - 80px);
            border-radius: 22px;
            overflow-y: auto;
            overflow-x: hidden;
            box-shadow: 0 30px 80px rgba(0,0,0,0.55);
            scrollbar-width: thin;
            scrollbar-color: rgba(201,168,106,0.45) transparent;
          }
          .public-frame::-webkit-scrollbar {
            width: 6px;
          }
          .public-frame::-webkit-scrollbar-thumb {
            background: rgba(201,168,106,0.45);
            border-radius: 3px;
          }
        }
      `}</style>
    </div>
  );
}
