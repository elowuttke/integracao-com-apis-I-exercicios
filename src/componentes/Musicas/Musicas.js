import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Botao,
  ContainerInputs,
  ContainerMusicas,
  InputMusica,
  Musica,
} from "./styled";

export default function Musicas(props) {
  const [musicas, setMusicas] = useState([]);
  const [artista, setArtista] = useState("");
  const [musica, setMusica] = useState("");
  const [url, setUrl] = useState("");

  const headers = {
    headers: {
      Authorization: "eloisa-wuttke-conway",
    },
  };

  const novaMusica = {
    name: musica,
    artist: artista,
    url: url,
  };

  const recebeMusicas = (id) => {
    axios
      .get(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${id}/tracks`,
        headers
      )
      .then((resposta) => {
        setMusicas(resposta.data.result.tracks);
      })
      .catch((erro) => {
        console.log(erro.response);
      });
  };

  const adicionaMusica = (id) => {
    axios
      .post(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${id}/tracks`,
        novaMusica,
        headers
      )
      .then(() => {
        recebeMusicas(id);
        setArtista("")
        setMusica("")
        setUrl("")
      })
      .catch((erro) => {
        console.log(erro.response);
      });
  };

  const removeMusica = (playlistId, trackId) => {
    axios
      .delete(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlistId}/tracks/${trackId}`,
        headers
      )
      .then(() => {
        recebeMusicas(playlistId);
      })
      .catch((erro) => {
        console.log(erro.response);
      });
  };

  useEffect(() => {
    recebeMusicas(props.playlist.id);
  }, [props.playlist.id]);

  return (
    <ContainerMusicas>
      <h2>{props.playlist.name}</h2>
      {musicas.map((musica) => {
        return (
          <Musica key={musica.id}>
            <h3>
              {musica.name} - {musica.artist}
            </h3>
            <audio src={musica.url} controls />
            <button onClick={() => removeMusica(props.playlist.id, musica.id)}>X</button>
          </Musica>
        );
      })}
      <ContainerInputs>
        <InputMusica
          value={artista}
          onChange={(e) => {
            setArtista(e.target.value);
          }}
          placeholder="artista"
        />
        <InputMusica
          value={musica}
          onChange={(e) => {
            setMusica(e.target.value);
          }}
          placeholder="musica"
        />
        <InputMusica
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          placeholder="url"
        />
        <Botao onClick={() => adicionaMusica(props.playlist.id)}>
          Adicionar musica
        </Botao>
      </ContainerInputs>
    </ContainerMusicas>
  );
}
