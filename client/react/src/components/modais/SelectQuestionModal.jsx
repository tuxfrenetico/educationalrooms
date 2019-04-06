import React from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Zoom,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Checkbox
} from '@material-ui/core'
import { connect } from 'react-redux'

import Stars from '../question/Stars'

import { AppTexts } from '../../helpers/appTexts'

class SelectQuestionModal extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      questions: [],
      selectedQuestions: {},
      qSelected: {}
    }
  }

  onEnter() {
    this.setState({ questions: [] })
    const selectedQuestions = {},
      questions = this.props.questions || []
    if (this.props.ids)
      this.props.ids.forEach(p => selectedQuestions[p] = true)
    setTimeout(() => this.setState({ selectedQuestions, questions }), 50);
  }

  selectQuestion(selected, id) {
    const { selectedQuestions } = this.state
    selectedQuestions[id] = selected
    this.setState({ selectedQuestions })
  }

  ok() {
    const ids = []
    const { selectedQuestions } = this.state
    for (let id in selectedQuestions)
      if (selectedQuestions[id])
        ids.push(Number(id))
    this.props.onResult(ids)
  }

  render() {

    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.close()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        transitionDuration={300}
        maxWidth={false}
        onEnter={() => this.onEnter()}
        TransitionComponent={Zoom}>
        <DialogContent>
          <Table aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell style={{ color: '#AAA', fontWeight: 'bold', textAlign: 'center' }}>{AppTexts.MyQuestionsTable.Area[this.props.language]}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{AppTexts.MyQuestionsTable.Difficulty[this.props.language]}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{AppTexts.MyQuestionsTable.Description[this.props.language]}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{AppTexts.MyQuestionsTable.Answers[this.props.language]}</TableCell>
                <TableCell style={{ textAlign: 'center' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.questions
                .map(n => (
                  <TableRow
                    tabIndex={-1}
                    key={n.id}>
                    <TableCell component="th" scope="row" padding="none" style={{ textAlign: 'center' }}>
                      {n.area}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Stars filled={n.difficulty || 0} />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }} numeric>{n.description}</TableCell>
                    <TableCell style={{ textAlign: 'center' }} numeric>{n.answers.length}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Checkbox
                        color="primary"
                        checked={this.state.selectedQuestions[n.id]}
                        onChange={(_, v) => this.selectQuestion(v, n.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {this.state.emptyRows > 0 && (
                <TableRow style={{ height: 49 * this.state.emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.ok()} color="primary" variant="raised" autoFocus>ok</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({ language: state.appState.language })

export default connect(mapStateToProps)(SelectQuestionModal)