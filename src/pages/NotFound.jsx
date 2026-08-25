import { Link } from 'react-router-dom';

export default function NotFound({ isInvitation }) {
  return (
    <div className="notfound">
      <span className="notfound-mark">T</span>
      <h1>{isInvitation ? 'Taklifnoma topilmadi' : 'Sahifa topilmadi'}</h1>
      <p>
        {isInvitation
          ? 'Ushbu havola noto\u2018g\u2018ri yoki taklifnoma hali nashr qilinmagan bo\u2018lishi mumkin.'
          : 'Siz izlagan sahifa mavjud emas.'}
      </p>
      <Link to="/" className="notfound-link">Bosh sahifaga qaytish</Link>

      <style>{`
        .notfound {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          background: #0c0e13;
          color: #f2ede1;
          text-align: center;
          padding: 24px;
          font-family: 'Jost', sans-serif;
        }
        .notfound-mark {
          width: 44px; height: 44px; border-radius: 10px; background: #c9a86a; color: #14161b;
          display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 20px; margin-bottom: 8px;
        }
        .notfound h1 { font-family: 'Playfair Display', serif; font-size: 24px; margin: 0; }
        .notfound p { font-size: 14px; color: #a9a49a; max-width: 340px; margin: 0; }
        .notfound-link { margin-top: 10px; color: #c9a86a; font-size: 13px; border-bottom: 1px solid rgba(201,168,106,0.4); padding-bottom: 2px; }
      `}</style>
    </div>
  );
}
