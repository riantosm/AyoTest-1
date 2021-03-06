import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Axios from 'axios';
import {assessment} from '../../redux/actions/assessment';

import font from '../Fonts';
import styles from './Style';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';

const URL_STRING = 'http://3.85.4.188:3333/api';

const teacherHome = props => {
  const [code, inputCode] = useState('');
  const [modalDetail, modalD] = useState(false);
  const [idAssessmentE, setIdAssessmentE] = useState(null);
  const [idAssessmentA, setIdAssessmentA] = useState(null);
  const [idAdmin, setId] = useState(0);
  const [modalAdd, modalA] = useState(false);
  const [modalEdit, modalE] = useState(false);
  const [modalEditSoal, modalES] = useState(false);
  const [loading, setLoading] = useState(true);
  const [post, setpost] = useState(true);
  // state addModal
  const [boxSoal, createSoal] = useState(null);
  const [assessmentName, setAssessmentName] = useState('');
  const [total, setTotal] = useState(null);
  // end state addModal

  // state add assessment
  const [boxAssessment, createAssessment] = useState(null);
  const [dataAssessment, setDataAssessment] = useState([]);
  const dispatch = useDispatch();
  // end state add assessment

  // state submit soal in ModalAdd
  const [soal, setSoal] = useState(null);
  const [answerA, setAnswerA] = useState('');
  const [answerB, setAnswerB] = useState('');
  const [answerC, setAnswerC] = useState('');
  const [answerD, setAnswerD] = useState('');
  const [answerE, setAnswerE] = useState('');
  // end state submit soal in ModalAdd
  const [detailAssessment, setDetailAssessment] = useState(null);

  // state detail

  // logic Modaladd going here
  const addAssesmentModal = () => {
    fCreateSoal();
  };
  const addClose = () => {
    modalE(true);
  };
  const fDetailQuestion = id => {
    modalES(true);
    detailQuestion(id);
    setIdAssessmentE(id);
  };
  const detailQuestion = async id => {
    console.log(idAssessmentE);
    await Axios.get(`${URL_STRING}/question/detail/${id}`).then(result => {
      setSoal(result.data.data[0].question);
      setAnswerA(result.data.data[0].answer[0].label);
      setAnswerB(result.data.data[0].answer[1].label);
      setAnswerC(result.data.data[0].answer[2].label);
      setAnswerD(result.data.data[0].answer[3].label);
      setAnswerE(result.data.data[0].answer[4].label);
    });
  };
  const fCreateSoal = () => {
    addClose();
    let items = [];
    for (let i = 1; i <= total; i++) {
      items.push(
        <TouchableOpacity onPress={() => fDetailQuestion(i)}>
          <View
            style={[
              styles.boxWrapp,
              styles.shadow,
              {margin: 0, flexDirection: 'row', flexWrap: 'wrap'},
            ]}>
            <Text numberOfLines={1}>
              {i}. Soal {i}
            </Text>
          </View>
        </TouchableOpacity>,
      );
    }
    return createSoal(items);
  };
  const handleAdd = () => {
    Axios.post(`${URL_STRING}/assessment/insert`, {
      id_admin: idAdmin,
      code: '321',
      name: assessmentName,
    })
      .then(resolve => {
        console.log(resolve.data.data.insertId);
        setpost(!post ? true : true);
        addAssesmentModal();
      })
      .catch(err => {});
  };
  // end logic add
  // logic submit soal
  const closeSoalInput = () => {
    addClose();
    modalES(false);
    createAssessment(null);
    setLoading(true);
  };
  const handlePostSoal = () => {
    Axios.post(`${URL_STRING}/question/insert`, {
      question: soal,
      id_assessment_name: idAssessmentA,
      choice_1: answerA,
      choice_2: answerB,
      choice_3: answerC,
      choice_4: answerD,
      choice_5: answerE,
    });
  };
  const handleEditSoal = () => {
    console.log(idAssessmentE);
    Axios.put(`${URL_STRING}/question/update/${idAssessmentE}`, {
      id_assessment_name: idAssessmentE,
      question: soal,
      choice_1: answerA,
      choice_2: answerB,
      choice_3: answerC,
      choice_4: answerD,
      choice_5: answerE,
    });
  };
  const handleSubmitSoal = async id => {
    if (post) {
      await handlePostSoal();
      closeSoalInput();
    } else {
      await handleEditSoal(id);
      closeSoalInput();
    }
  };
  // end submit soal

  // assessment logic going here
  const refreshHome = () => {
    if (loading) {
      console.log('dilakukan getAssessment');
      getAssessment();
    } else {
      console.log('dilakukan createAssessment');
      fCreateAsessment();
    }
  };
  const getAssessment = async () => {
    await Axios.get(`${URL_STRING}/assessment/detailbyadmin/${idAdmin}`)
      .then(result => {
        setDataAssessment(result.data.data);
        setIdAssessmentA(result.data.data.length + 1);
        setLoading(false);
      })
      .catch(err => {
        Alert.alert(err);
      });
  };
  const fCreateAsessment = () => {
    const items = [];
    for (let i = 1; i <= dataAssessment.length; i++) {
      items.push(
        <TouchableOpacity
          onPress={
            () =>
              fDetailAssessment(
                dataAssessment[i - 1].id_assessment,
              ) /*  modalD(true) */
          }>
          <View style={[styles.boxWrapp, styles.shadow, styles.listMinMargin]}>
            <Text numberOfLines={1}>
              {i}. {dataAssessment[i - 1].name}{' '}
            </Text>
          </View>
        </TouchableOpacity>,
      );
    }
    return createAssessment(items);
  };
  // end assessment logic

  // detailAssessment logic
  const fDetailAssessment = id => {
    getDetail(id);
    openModal();
    setLoading(true);
  };
  const openModal = () => modalD(true);
  const getDetail = async id => {
    setIdAssessmentE(id);
    await Axios.get(`${URL_STRING}/assessment/detail/${id}`)
      .then(result => {
        setpost(false);
        setDetailAssessment(result.data.data);
        setTotal(result.data.data.jumlah_soal);
        setLoading(false);
      })
      .catch(err => Alert.alert(err));
  };

  // useEffect flow
  useEffect(() => {
    refreshHome();
  }, []);
  useEffect(() => {
    console.log(soal);
    refreshHome();
  }, [loading]);
  // end useEffect flow
  return (
    <>
      {loading === false ? (
        <KeyboardAvoidingView style={styles.containerView}>
          <View style={[styles.MainContainer]}>
            <ScrollView
              style={{width: '100%', marginBottom: 40, marginTop: 20}}>
              <View style={{marginBottom: 20}}>
                <Text
                  style={[
                    font.Aquawax,
                    {
                      fontSize: 40,
                      padding: 20,
                      paddingBottom: 10,
                      color: '#333333',
                    },
                  ]}>
                  Daftar <Text style={styles.textWhite}>Pelajaran</Text>.
                </Text>
                <View
                  style={{
                    width: 50,
                    marginHorizontal: 20,
                    borderColor: '#333333',
                    borderWidth: 1,
                  }}></View>
              </View>
              {/* loop segini */}
              <View
                style={[
                  styles.boxWrappSearch,
                  styles.shadow,
                  styles.listMinMargin,
                  {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  },
                ]}>
                <TextInput
                  placeholder="Search ..."
                  style={{width: '90%'}}></TextInput>
                <TouchableOpacity>
                  <Text style={{paddingVertical: 20}}>
                    <Icon name="search" size={23} style={styles.textBlack} />
                  </Text>
                </TouchableOpacity>
              </View>
              {boxAssessment}

              <View style={{padding: 20}}>
                <TouchableOpacity onPress={() => modalA(true)}>
                  <View
                    style={[
                      styles.submit,
                      styles.bgBlack,
                      styles.shadow,
                      {marginTop: 0, width: '100%', alignSelf: 'center'},
                    ]}>
                    <Text style={{color: '#fff', textAlign: 'center'}}>
                      Tambah Pelajaran
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.bottomView}>
              {/* list murid */}
              <TouchableOpacity
                style={{
                  width: '40%',
                  height: '100%',
                }}
                onPress={() => props.navigation.navigate('teacher-live')}>
                <View>
                  <Text style={styles.textStyle}>
                    <Icon
                      name="street-view"
                      size={23}
                      style={styles.textBlack}
                    />
                  </Text>
                </View>
              </TouchableOpacity>
              {/* list murid */}
              {/* add assessment */}
              <TouchableOpacity
                style={[styles.btnCircle, styles.bgBlack, styles.shadow]}>
                <View style={styles.circleIcon}>
                  <Text style={{color: '#fff'}}>
                    <Icon
                      name="book-reader"
                      size={30}
                      style={styles.textWhite}
                    />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '20%',
                  height: '100%',
                }}
                onPress={() => props.navigation.navigate('teacher-home')}>
                {/* hanya sepasi */}
              </TouchableOpacity>
              {/* add assessment */}
              {/* profile teacher */}
              <TouchableOpacity
                style={{
                  width: '40%',
                  height: '100%',
                }}
                onPress={() => props.navigation.navigate('teacher-detail')}>
                <View>
                  <Text style={styles.textStyle}>
                    <Icon name="child" size={23} style={styles.textBlack} />
                  </Text>
                </View>
              </TouchableOpacity>
              {/* profile teacher */}
            </View>
          </View>

          {/* modal detail pelajaran */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalDetail}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={[styles.wrapp, styles.containerView]}>
              <ScrollView style={{height: '85%'}}>
                <View style={{marginBottom: 20}}>
                  <Text
                    style={[
                      font.Aquawax,
                      {fontSize: 35, paddingHorizontal: 0, paddingBottom: 10},
                    ]}>
                    Detail <Text style={styles.textWhite}>Pelajaran</Text>.
                  </Text>
                  <View
                    style={{
                      width: 50,
                      marginHorizontal: 0,
                      borderColor: '#333333',
                      borderWidth: 1,
                    }}></View>
                </View>
                <View
                  style={[
                    styles.boxWrapp,
                    styles.shadow,
                    {margin: 0, flexDirection: 'row', flexWrap: 'wrap'},
                  ]}>
                  <Text style={{width: '40%'}}>Nama Matkul </Text>
                  <Text style={{width: '10%'}}>:</Text>
                  <Text style={{width: '50%', fontWeight: '700'}}>
                    {detailAssessment === null ? '' : detailAssessment.name}
                  </Text>
                  <Text style={{width: '40%', paddingTop: 10}}>Status </Text>
                  <Text style={{width: '10%', paddingTop: 10}}>:</Text>
                  <Text
                    style={{width: '50%', paddingTop: 10, fontWeight: '700'}}>
                    {detailAssessment === null ? '' : detailAssessment.hide}
                  </Text>
                  <Text style={{width: '40%', paddingTop: 10}}>
                    Jumlah Soal{' '}
                  </Text>
                  <Text style={{width: '10%', paddingTop: 10}}>:</Text>
                  <Text
                    style={{width: '50%', paddingTop: 10, fontWeight: '700'}}>
                    {detailAssessment === null
                      ? ''
                      : detailAssessment.jumlah_soal}
                  </Text>
                  <Text style={{width: '40%', paddingTop: 10}}>
                    Banyak siswa
                  </Text>
                  <Text style={{width: '10%', paddingTop: 10}}>:</Text>
                  <Text
                    style={{width: '50%', fontWeight: '700', paddingTop: 10}}>
                    {detailAssessment === null
                      ? ''
                      : detailAssessment.jumlah_peserta}
                  </Text>
                  <Text style={{width: '40%', paddingTop: 10}}>
                    Rata - rata nilai
                  </Text>
                  <Text style={{width: '10%', paddingTop: 10}}>:</Text>
                  <Text
                    style={{width: '50%', fontWeight: '700', paddingTop: 10}}>
                    79
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      addAssesmentModal();
                      // modalE(true);
                    }}
                    style={{width: '100%'}}>
                    <View
                      style={[
                        styles.boxSm,
                        styles.bgBlack,
                        styles.shadow,
                        {marginTop: 20, width: '100%'},
                      ]}>
                      <Text
                        style={[
                          font.Aquawax,
                          {
                            color: '#fff',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 14,
                          },
                        ]}>
                        Rubah Soal
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      modalD(false);
                    }}
                    style={{width: '100%'}}>
                    <View
                      style={[
                        styles.boxSm,
                        styles.bgBlack,
                        styles.shadow,
                        {marginTop: 20, width: '100%'},
                      ]}>
                      <Text
                        style={[
                          font.Aquawax,
                          {
                            color: '#fff',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 14,
                          },
                        ]}>
                        Hapus Pelajaran
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.boxWrapp,
                    styles.shadow,
                    {margin: 0, flexDirection: 'row', flexWrap: 'wrap'},
                  ]}>
                  <Text style={{width: '40%'}}>Status </Text>
                  <Text style={{width: '10%'}}>:</Text>
                  <Text style={{width: '50%', fontWeight: '700'}}>
                    Tidak Aktif
                  </Text>
                  <TouchableOpacity style={{width: '100%'}}>
                    <View
                      style={[
                        styles.boxSm,
                        styles.bgBlack,
                        styles.shadow,
                        {marginTop: 20, width: '100%'},
                      ]}>
                      <Text
                        style={[
                          font.Aquawax,
                          {
                            color: '#fff',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 14,
                          },
                        ]}>
                        Aktifkan Soal
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                style={{width: '100%'}}>
                <View
                  style={[
                    styles.boxSm,
                    styles.bgWhite,
                    styles.shadow,
                    {marginTop: 20, width: '100%'},
                  ]}>
                  <Text
                    style={[
                      font.Aquawax,
                      {
                        color: '#333333',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 14,
                      },
                    ]}>
                    Non-Aktifkan Soal
                  </Text>
                </View>
              </TouchableOpacity> */}
                </View>
              </ScrollView>
              <View
                style={{
                  width: '100%',
                  margin: 0,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    modalD(false);
                  }}
                  style={{width: '100%'}}>
                  <View
                    style={[
                      styles.boxSm,
                      styles.bgWhite,
                      styles.shadow,
                      {marginTop: 20},
                    ]}>
                    <Text
                      style={[
                        font.Aquawax,
                        {
                          color: '#333333',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          fontSize: 14,
                        },
                      ]}>
                      Statistik Siswa
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => modalD(false)}>
                <View
                  style={[
                    styles.boxSm,
                    styles.bgBlack,
                    styles.shadow,
                    {marginTop: 20},
                  ]}>
                  <Text
                    style={[
                      font.Aquawax,
                      {
                        color: '#fff',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 14,
                      },
                    ]}>
                    Kembali
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* modal detail pelajaran */}

          {/* modal tambah */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalAdd}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={[styles.wrapp, styles.containerView]}>
              <ScrollView style={{height: '85%'}}>
                <View style={{marginBottom: 20}}>
                  <Text
                    style={[
                      font.Aquawax,
                      {
                        fontSize: 35,
                        paddingHorizontal: 0,
                        paddingBottom: 10,
                        color: '#333333',
                      },
                    ]}>
                    Tambah <Text style={styles.textWhite}>Pelajaran</Text>.
                  </Text>
                  <View
                    style={{
                      width: 50,
                      marginHorizontal: 0,
                      borderColor: '#333333',
                      borderWidth: 1,
                    }}></View>
                </View>
                <View
                  style={[
                    styles.boxWrapp,
                    styles.shadow,
                    {margin: 0, flexDirection: 'row', flexWrap: 'wrap'},
                  ]}>
                  <Text style={{width: '40%'}}>Nama Matkul </Text>
                  <TextInput
                    placeholder="Masukan nama pelajaran"
                    style={styles.inputText}
                    onChangeText={text => setAssessmentName(text)}
                  />
                  <Text style={{width: '40%'}}>Jumlah Soal </Text>
                  <TextInput
                    placeholder="Masukan jumlah soal"
                    style={styles.inputText}
                    onChangeText={text => setTotal(text)}
                    keyboardType={'numeric'}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      handleAdd();
                    }}
                    style={{width: '100%'}}>
                    <View
                      style={[
                        styles.boxSm,
                        styles.bgBlack,
                        styles.shadow,
                        {marginTop: 20, width: '100%'},
                      ]}>
                      <Text
                        style={[
                          font.Aquawax,
                          {
                            color: '#fff',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 14,
                          },
                        ]}>
                        Simpan dan Edit Soal
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <TouchableOpacity onPress={() => modalA(false)}>
                <View
                  style={[
                    styles.boxSm,
                    styles.bgBlack,
                    styles.shadow,
                    {marginTop: 20},
                  ]}>
                  <Text
                    style={[
                      font.Aquawax,
                      {
                        color: '#fff',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 14,
                      },
                    ]}>
                    Kembali
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* modal tambah */}

          {/* modal Edit soal */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalEdit}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={[styles.wrapp, styles.containerView]}>
              <ScrollView style={{height: '85%'}}>
                <View style={{marginBottom: 20}}>
                  <Text
                    style={[
                      font.Aquawax,
                      {
                        fontSize: 35,
                        paddingHorizontal: 0,
                        paddingBottom: 10,
                        color: '#333333',
                      },
                    ]}>
                    Edit <Text style={styles.textWhite}>Pelajaran</Text>.
                  </Text>
                  <View
                    style={{
                      width: 50,
                      marginHorizontal: 0,
                      borderColor: '#333333',
                      borderWidth: 1,
                    }}></View>
                </View>
                <View
                  style={[
                    styles.boxWrapp,
                    styles.shadow,
                    {margin: 0, flexDirection: 'row', flexWrap: 'wrap'},
                  ]}>
                  <Text style={{width: '40%'}}>Nama Matkul </Text>
                  <TextInput
                    placeholder="Masukan nama pelajaran"
                    style={styles.inputText}
                    value={
                      assessmentName
                        ? `${assessmentName}`
                        : detailAssessment
                        ? `${detailAssessment.name}`
                        : ''
                    }
                  />
                </View>

                <View style={{marginBottom: 20}}>
                  <Text
                    style={[
                      font.Aquawax,
                      {
                        fontSize: 35,
                        paddingHorizontal: 0,
                        paddingBottom: 10,
                        color: '#333333',
                      },
                    ]}>
                    Edit <Text style={styles.textWhite}>Soal</Text>.
                  </Text>
                  <View
                    style={{
                      width: 50,
                      marginHorizontal: 0,
                      borderColor: '#333333',
                      borderWidth: 1,
                    }}></View>
                </View>

                {/* satu soal */}
                {boxSoal}
                {/* satu soal */}

                <TouchableOpacity
                  onPress={() => {
                    modalA(false);
                    modalE(false);
                  }}
                  style={{width: '100%'}}>
                  <View
                    style={[
                      styles.boxSm,
                      styles.bgBlack,
                      styles.shadow,
                      {marginTop: 20, width: '100%'},
                    ]}>
                    <Text
                      style={[
                        font.Aquawax,
                        {
                          color: '#fff',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          fontSize: 14,
                        },
                      ]}>
                      Simpan
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    modalA(false);
                    modalE(false);
                    setTotal(null);
                    setAssessmentName('');
                  }}>
                  <View
                    style={[
                      styles.boxSm,
                      styles.bgBlack,
                      styles.shadow,
                      {marginVertical: 20},
                    ]}>
                    <Text
                      style={[
                        font.Aquawax,
                        {
                          color: '#fff',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          fontSize: 14,
                        },
                      ]}>
                      Kembali
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Modal>
          {/* modal Edit soal */}

          {/* modal edit satu soal */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalEditSoal}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={[styles.wrapp, styles.containerView]}>
              <ScrollView style={{height: '85%'}}>
                <View>
                  <View
                    style={[
                      styles.boxWrapp,
                      styles.shadow,
                      {
                        margin: 0,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      },
                    ]}>
                    <Text>Soal</Text>
                    <TextInput
                      value={soal === null ? '' : `${soal}`}
                      multiline={true}
                      numberOfLines={4}
                      onChangeText={text => setSoal(text)}
                      style={[
                        styles.inputText,
                        {paddingHorizontal: 10},
                      ]}></TextInput>
                  </View>
                </View>
                <View>
                  <View
                    style={[
                      styles.boxWrapp,
                      styles.shadow,
                      {
                        margin: 0,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      },
                    ]}>
                    <Text style={{width: '100%'}}>Jawaban</Text>
                    {/* A */}
                    <Text
                      style={{
                        width: '10%',
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}>
                      A.
                    </Text>
                    <TextInput
                      value={answerA === null ? '' : `${answerA}`}
                      multiline={true}
                      numberOfLines={1}
                      onChangeText={text => setAnswerA(text)}
                      style={[
                        styles.inputText,
                        {paddingHorizontal: 10, width: '90%'},
                      ]}></TextInput>
                    {/* A */}
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#999999',
                        width: '100%',
                      }}
                    />
                    {/* B */}
                    <Text
                      style={{
                        width: '10%',
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}>
                      B.
                    </Text>
                    <TextInput
                      value={answerB === null ? '' : `${answerB}`}
                      multiline={true}
                      numberOfLines={1}
                      onChangeText={text => setAnswerB(text)}
                      style={[
                        styles.inputText,
                        {paddingHorizontal: 10, width: '90%'},
                      ]}></TextInput>
                    {/* B */}
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#999999',
                        width: '100%',
                      }}
                    />
                    {/* C */}
                    <Text
                      style={{
                        width: '10%',
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}>
                      C.
                    </Text>
                    <TextInput
                      value={answerC === null ? '' : `${answerC}`}
                      multiline={true}
                      numberOfLines={1}
                      onChangeText={text => setAnswerC(text)}
                      style={[
                        styles.inputText,
                        {paddingHorizontal: 10, width: '90%'},
                      ]}></TextInput>
                    {/* C */}
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#999999',
                        width: '100%',
                      }}
                    />
                    {/* D */}
                    <Text
                      style={{
                        width: '10%',
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}>
                      D.
                    </Text>
                    <TextInput
                      value={answerD === null ? '' : `${answerD}`}
                      multiline={true}
                      numberOfLines={1}
                      onChangeText={text => setAnswerD(text)}
                      style={[
                        styles.inputText,
                        {paddingHorizontal: 10, width: '90%'},
                      ]}></TextInput>
                    {/* D */}
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#999999',
                        width: '100%',
                      }}
                    />
                    {/* E */}
                    <Text
                      style={{
                        width: '10%',
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}>
                      E.
                    </Text>
                    <TextInput
                      value={answerE === null ? '' : `${answerE}`}
                      multiline={true}
                      numberOfLines={1}
                      onChangeText={text => setAnswerE(text)}
                      style={[
                        styles.inputText,
                        {paddingHorizontal: 10, width: '90%'},
                      ]}></TextInput>
                    {/* E */}
                  </View>
                  <TouchableOpacity
                    style={{width: '100%'}}
                    onPress={() => handleSubmitSoal()}>
                    <View
                      style={[
                        styles.boxSm,
                        styles.bgBlack,
                        styles.shadow,
                        {marginTop: 0, width: '100%', marginBottom: 20},
                      ]}>
                      <Text
                        style={[
                          font.Aquawax,
                          {
                            color: '#fff',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 14,
                          },
                        ]}>
                        Simpan
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>
          {/* modal edit satu soal */}
        </KeyboardAvoidingView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </>
  );
};

export default teacherHome;
